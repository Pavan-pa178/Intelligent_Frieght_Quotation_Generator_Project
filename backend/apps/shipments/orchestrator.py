"""
AI Freight Quote Orchestration Pipeline
========================================
Implements the full documented M1 → M2 → M3 → Quote Engine flow:

  CUSTOMER → SHIPMENT (SUBMITTED)
    → M1: Route Intelligence Agent       (build_route_options)
    → M1: Rule-Based Pricing Engine      (compute_rule_price)
    → M2: ML Pricing Agent               (predict_freight_price_ml / LightGBM)
    → M3: Weather Risk Agent             (sample_weather_along_route)
    → M3: Customs Intelligence Agent     (run_customs_validation)
    → M3: Composite Risk Engine          (calculate_composite_risk)
    → QUOTE ENGINE: combine all outputs  (save enriched quote to MongoDB)
  STATUS: SUBMITTED → PROCESSING → ANALYZED → QUOTED
"""
import uuid
import math
from datetime import datetime, timezone

from core.mongodb import get_collection

# ─── Status Lifecycle ─────────────────────────────────────────────────────────
STATUS_SUBMITTED  = 'SUBMITTED'
STATUS_PROCESSING = 'PROCESSING'
STATUS_ANALYZED   = 'ANALYZED'
STATUS_QUOTED     = 'QUOTED'


def _update_shipment_status(shipment_id, new_status):
    try:
        col = get_collection('shipments')
        if col is not None:
            col.update_one(
                {'shipment_id': shipment_id},
                {'$set': {'pipeline_status': new_status, 'updated_at': datetime.now(timezone.utc).isoformat()}},
                upsert=False
            )
    except Exception:
        pass


# ─── M1: Rule-Based Pricing (inline — no request object needed) ───────────────
def _compute_rule_price(origin_code, dest_code, mode, weight_kg, volume_cbm,
                         container_count, container_type, distance_nm):
    """Computes rule-based freight price matching LiveEstimateView logic."""
    baf_pct  = 0.10
    doc_fee  = 3000
    margin   = 0.15

    if mode in ('OCEAN', 'ocean'):
        type_factor = 0.70 if container_type == '20GP' else (1.15 if container_type == '45HC' else 1.0)
        rate_per_ctr = (24000 + (distance_nm * 12)) * type_factor
        base_rate    = round(rate_per_ctr * container_count)
        thc_amount   = round(8000 * container_count)
        units_label  = f"{container_count} × {container_type}"
    elif mode in ('AIR', 'EXPRESS_AIR'):
        per_kg     = 180 if mode == 'EXPRESS_AIR' else 110
        base_rate  = round(max(8000, per_kg * weight_kg))
        thc_amount = round(12 * weight_kg)
        units_label = f"{math.ceil(weight_kg)} kg"
    else:
        base_rate  = round(max(8000, 18 * weight_kg))
        thc_amount = round(1500)
        units_label = f"{weight_kg} kg"

    baf_amount  = round(base_rate * baf_pct)
    total_cost  = base_rate + baf_amount + thc_amount + doc_fee
    margin_amt  = round(total_cost * margin)
    final_price = total_cost + margin_amt

    return {
        'base_rate':       base_rate,
        'baf_amount':      baf_amount,
        'thc_amount':      thc_amount,
        'doc_fee':         doc_fee,
        'total_cost':      total_cost,
        'margin_amount':   margin_amt,
        'final_sell_price': final_price,
        'units_label':     units_label,
        'cost_breakdown': [
            {'label': 'Base Freight',                       'val': base_rate},
            {'label': f'BAF ({round(baf_pct*100)}%)',       'val': baf_amount},
            {'label': 'Origin THC',                         'val': thc_amount},
            {'label': 'Documentation Fee',                  'val': doc_fee},
            {'label': 'Total Cost',                         'val': total_cost,  'isSubtotal': True},
            {'label': f'Margin ({round(margin*100)}%)',     'val': margin_amt},
            {'label': 'Final Sell Price',                   'val': final_price, 'isTotal': True},
        ]
    }


# ─── Quote Engine — Combine M1 + M2 + M3 ─────────────────────────────────────
def _assemble_quote(shipment_id, user_email, shipment_payload,
                    route_result, rule_result, ml_result,
                    weather_result, customs_result, risk_result,
                    origin_gw, dest_gw):
    """Merges all agent outputs into the canonical quote record and persists to MongoDB."""
    now_str  = datetime.now(timezone.utc).isoformat()
    quote_id = shipment_payload.get('quote_id') or f"QT-2026-{str(uuid.uuid4().int)[:5]}"
    mode     = shipment_payload.get('service', 'Ocean FCL')
    mode_key = shipment_payload.get('modeKey', 'ocean')
    origin_city = shipment_payload.get('from', origin_gw.get('city', 'Origin') if origin_gw else 'Origin')
    dest_city   = shipment_payload.get('to',   dest_gw.get('city', 'Dest') if dest_gw else 'Dest')

    # Determine final price: if ML model loaded & high confidence, use ML; else rule
    ml_price   = ml_result.get('ml_predicted_price', rule_result['final_sell_price'])
    rule_price = rule_result['final_sell_price']
    ml_conf    = ml_result.get('confidence_level', 'LOW')
    final_total = ml_price if ml_result.get('is_model_loaded') and ml_conf in ('HIGH', 'MEDIUM') else rule_price

    quote = {
        'id':              quote_id,
        'shipment_id':     shipment_id,
        'user_email':      user_email,
        'customer':        shipment_payload.get('customer', user_email),
        'city':            origin_city,
        'laneCode':        f"{origin_gw.get('code','?')} → {dest_gw.get('code','?')}" if origin_gw and dest_gw else '',
        'laneName':        f"{origin_city} → {dest_city}",
        'region':          shipment_payload.get('region', ''),
        'mode':            mode,
        'modeKey':         mode_key,
        'basis':           rule_result.get('units_label', ''),
        'transit':         shipment_payload.get('transit', ''),
        'indicativeTotal': final_total,
        'status':          'QUOTED',
        'pipeline_status': STATUS_QUOTED,
        'created':         'Just now',
        'created_at':      now_str,

        # ── M1 outputs ──────────────────────────────────────────────────────
        'm1_route': {
            'routes':              route_result.get('routes', []),
            'recommended_carrier': next((r['carrier'] for r in route_result.get('routes', []) if r.get('recommended')), None),
            'origin_code':         route_result.get('originCode'),
            'dest_code':           route_result.get('destCode'),
        },
        'm1_pricing': {
            'rule_sell_price':  rule_price,
            'base_rate':        rule_result['base_rate'],
            'baf_amount':       rule_result['baf_amount'],
            'thc_amount':       rule_result['thc_amount'],
            'doc_fee':          rule_result['doc_fee'],
            'margin_amount':    rule_result['margin_amount'],
            'cost_breakdown':   rule_result['cost_breakdown'],
        },

        # ── M2 outputs ──────────────────────────────────────────────────────
        'm2_ml_pricing': {
            'ml_predicted_price': ml_price,
            'rule_based_price':   int(rule_price),
            'price_variance_pct': ml_result.get('price_variance_pct', 0),
            'confidence_level':   ml_conf,
            'is_model_loaded':    ml_result.get('is_model_loaded', False),
            'r2_score':           ml_result.get('r2_score', 0),
            'model_version':      ml_result.get('model_version', '2.0.0'),
            'top_features':       ml_result.get('top_features', []),
        },

        # ── M3 outputs ──────────────────────────────────────────────────────
        'm3_weather': {
            'risk_score':          weather_result.get('risk_score', 0),
            'risk_level':          weather_result.get('risk_level', 'LOW'),
            'delay_probability_pct': weather_result.get('delay_probability_pct', 0),
            'route_advice':        weather_result.get('route_advice', ''),
            'alerts':              weather_result.get('alerts', []),
            'storm_details':       weather_result.get('storm_details', []),
            'observations':        weather_result.get('observations', []),
            'max_wave_height_m':   weather_result.get('max_wave_height_m', 0),
            'max_wind_speed_kts':  weather_result.get('max_wind_speed_kts', 0),
            'assessed_at':         weather_result.get('assessed_at', now_str),
        },
        'm3_customs': {
            'compliance_status':       customs_result.get('compliance_status', 'PENDING'),
            'readiness_score':         customs_result.get('readiness_score', 0),
            'requires_officer_review': customs_result.get('requires_officer_review', False),
            'missing_docs_count':      customs_result.get('missing_docs_count', 0),
            'checklist':               customs_result.get('document_checklist', []),
            'risk_flags':              customs_result.get('risk_flags', []),
            'retrieved_citations':     customs_result.get('retrieved_citations', [])[:3],
            'summary':                 customs_result.get('summary', ''),
            'hs_code':                 customs_result.get('hs_code', ''),
        },
        'm3_risk': {
            'overall_score':     risk_result.get('overall_score', 0),
            'risk_level':        risk_result.get('risk_level', 'LOW'),
            'primary_driver':    risk_result.get('primary_driver', ''),
            'explanation':       risk_result.get('explanation', ''),
            'guidance':          risk_result.get('operational_guidance', ''),
            'formula':           risk_result.get('formula', ''),
            'factor_breakdown':  risk_result.get('factor_breakdown', []),
            'assessed_at':       risk_result.get('assessed_at', now_str),
        },

        # ── Quote Engine final decision ──────────────────────────────────────
        'quote_engine': {
            'final_price':          final_total,
            'price_source':         'ML_LIGHTGBM' if ml_result.get('is_model_loaded') and ml_conf in ('HIGH','MEDIUM') else 'RULE_BASED',
            'risk_adjusted':        risk_result.get('risk_level', 'LOW') in ('HIGH', 'CRITICAL'),
            'requires_agent_review': (
                risk_result.get('risk_level', 'LOW') in ('HIGH', 'CRITICAL') or
                customs_result.get('requires_officer_review', False) or
                weather_result.get('risk_level', 'LOW') in ('HIGH', 'CRITICAL')
            ),
            'assembled_at': now_str,
        },

        'details': {
            'originGw':      origin_gw or {},
            'destGw':        dest_gw or {},
            'grossWeightKg': shipment_payload.get('weight', 0),
            'routes':        route_result.get('routes', []),
            'costBreakdown': rule_result['cost_breakdown'],
        },

        # ── Lifecycle ────────────────────────────────────────────────────────
        'agent_review':       None,
        'customer_decision':  None,
    }

    # Persist to MongoDB
    try:
        col = get_collection('quotes')
        if col is not None:
            col.update_one({'id': quote_id}, {'$set': quote}, upsert=True)
    except Exception:
        pass

    return quote


# ─── MAIN PIPELINE ENTRY POINT ───────────────────────────────────────────────
def run_quote_pipeline(shipment_id, shipment_payload, user_email=''):
    """
    Executes the full M1→M2→M3→Quote Engine pipeline for a shipment.
    Updates shipment status at each stage.
    Returns the final assembled quote record.
    """
    logs   = []
    now    = datetime.now(timezone.utc)

    # Extract shipment fields
    origin_gw       = shipment_payload.get('originGw') or shipment_payload.get('details', {}).get('originGw') or {}
    dest_gw         = shipment_payload.get('destGw')   or shipment_payload.get('details', {}).get('destGw')   or {}
    origin_code     = origin_gw.get('code', 'INMAA')
    dest_code       = dest_gw.get('code',   'SGSIN')
    mode            = (shipment_payload.get('modeKey') or shipment_payload.get('service', 'ocean')).upper().split()[0]
    weight_kg       = float(shipment_payload.get('weight', 5000))
    container_type  = shipment_payload.get('container_type',  '40HC')
    container_count = int(shipment_payload.get('container_count', 1))
    hs_code         = shipment_payload.get('hs_code',    '850440')
    commodity       = shipment_payload.get('commodity',  'General Merchandise')
    origin_country  = origin_gw.get('countryCode', 'IN')
    dest_country    = dest_gw.get('countryCode',   'SG')
    volume_cbm      = float(shipment_payload.get('volume_cbm', max(1.0, weight_kg / 500.0)))

    # Estimate distance from gateway pair (rough nm lookup)
    DIST_TABLE = {
        ('INNSA','AEJEA'): 1205, ('INNSA','NLRTM'): 6780, ('INNSA','SGSIN'): 2630,
        ('INNSA','DEHAM'): 7200, ('INMAA','NLRTM'): 8950, ('INMAA','SGSIN'): 2400,
        ('INMAA','AEJEA'): 1500, ('BOM','DXB'): 1100,
    }
    distance_nm = DIST_TABLE.get((origin_code, dest_code),
                  DIST_TABLE.get((dest_code, origin_code), 4000))

    # ── STAGE: SUBMITTED → PROCESSING ─────────────────────────────────────────
    _update_shipment_status(shipment_id, STATUS_PROCESSING)
    logs.append(f"[{now.isoformat()}] Pipeline started. Shipment: {shipment_id} | Route: {origin_code}→{dest_code}")

    # ── M1: ROUTE AGENT ───────────────────────────────────────────────────────
    from apps.routing.route_agent import build_route_options
    rule_indicative = (24000 + distance_nm * 12) * container_count
    routes = build_route_options(
        origin_code=origin_code,
        dest_code=dest_code,
        mode=mode,
        indicative_total=rule_indicative,
        is_hazardous=bool(shipment_payload.get('is_hazardous', False)),
        is_temp=bool(shipment_payload.get('is_temp_controlled', False)),
    )
    route_result = {'originCode': origin_code, 'destCode': dest_code, 'routes': routes}
    rec_carrier  = next((r['carrier'] for r in routes if r.get('recommended')), 'Maersk')
    logs.append(f"[M1-ROUTE] {len(routes)} carrier options found. Recommended: {rec_carrier}")

    # ── M1: RULE PRICING ──────────────────────────────────────────────────────
    rule_result = _compute_rule_price(
        origin_code, dest_code, mode,
        weight_kg, volume_cbm, container_count, container_type, distance_nm
    )
    logs.append(f"[M1-PRICE] Rule-based sell price: ₹{rule_result['final_sell_price']:,} (Base: ₹{rule_result['base_rate']:,})")

    # ── M2: ML PRICING AGENT (LightGBM) ───────────────────────────────────────
    from apps.ml_pricing.model import predict_freight_price_ml
    ml_result = predict_freight_price_ml(
        distance_nm=distance_nm,
        weight_kg=weight_kg,
        container_count=container_count,
        mode=mode,
        container_type=container_type,
        rule_price=rule_result['final_sell_price'],
        origin=origin_gw.get('city', 'Chennai'),
        destination=dest_gw.get('city', 'Singapore'),
        cargo_type=commodity,
    )
    logs.append(
        f"[M2-ML]    ML price: ₹{ml_result.get('ml_predicted_price',0):,} | "
        f"Variance: {ml_result.get('price_variance_pct',0)}% | "
        f"Confidence: {ml_result.get('confidence_level','?')} | "
        f"Model loaded: {ml_result.get('is_model_loaded', False)}"
    )

    # ── M3: WEATHER AGENT ─────────────────────────────────────────────────────
    from apps.weather.services import sample_weather_along_route
    weather_result = sample_weather_along_route(origin_code, dest_code, mode)
    logs.append(
        f"[M3-WEATHER] Risk: {weather_result.get('risk_level','?')} "
        f"(score {weather_result.get('risk_score',0)}) | "
        f"Delay prob: {weather_result.get('delay_probability_pct',0)}%"
    )

    # ── M3: CUSTOMS AGENT ─────────────────────────────────────────────────────
    from apps.customs.rag_service import run_customs_validation
    customs_result = run_customs_validation({
        'hs_code':          hs_code,
        'commodity':        commodity,
        'origin_country':   origin_country,
        'dest_country':     dest_country,
        'shipment_id':      shipment_id,
        'incoterm':         shipment_payload.get('incoterm', 'CIF'),
    })
    logs.append(
        f"[M3-CUSTOMS] Status: {customs_result.get('compliance_status','?')} | "
        f"Readiness: {customs_result.get('readiness_score',0)}% | "
        f"Officer review: {customs_result.get('requires_officer_review', False)}"
    )

    # ── STAGE: PROCESSING → ANALYZED ──────────────────────────────────────────
    _update_shipment_status(shipment_id, STATUS_ANALYZED)

    # ── M3: COMPOSITE RISK ENGINE ──────────────────────────────────────────────
    from apps.risk.engine import calculate_composite_risk
    weather_score = weather_result.get('risk_score', 25)
    customs_score = 65 if customs_result.get('requires_officer_review') else 30
    risk_result = calculate_composite_risk(
        weather_score=weather_score,
        customs_score=customs_score,
        route_score=22,
        port_score=18,
        cargo_score=12,
        details={
            'weather_reason': weather_result.get('route_advice', ''),
            'customs_reason': customs_result.get('summary', ''),
        }
    )
    logs.append(
        f"[M3-RISK]  Composite: {risk_result.get('overall_score',0)}/100 = "
        f"{risk_result.get('risk_level','?')} | "
        f"Driver: {risk_result.get('primary_driver','?')}"
    )

    # ── QUOTE ENGINE: Combine & Save ──────────────────────────────────────────
    quote = _assemble_quote(
        shipment_id      = shipment_id,
        user_email       = user_email,
        shipment_payload = shipment_payload,
        route_result     = route_result,
        rule_result      = rule_result,
        ml_result        = ml_result,
        weather_result   = weather_result,
        customs_result   = customs_result,
        risk_result      = risk_result,
        origin_gw        = origin_gw,
        dest_gw          = dest_gw,
    )
    _update_shipment_status(shipment_id, STATUS_QUOTED)
    logs.append(
        f"[QUOTE-ENGINE] Quote {quote['id']} assembled. "
        f"Final price: ₹{quote['indicativeTotal']:,} "
        f"(source: {quote['quote_engine']['price_source']}) | "
        f"Agent review needed: {quote['quote_engine']['requires_agent_review']}"
    )

    return {
        'quote':       quote,
        'quote_id':    quote['id'],
        'pipeline_logs': logs,
        'completed_at': datetime.now(timezone.utc).isoformat(),
    }
