import random
from datetime import datetime, timezone

def calculate_composite_risk(weather_score=25, customs_score=35, route_score=20, port_score=15, cargo_score=10, details=None):
    """
    Weighted 5-Factor Composite Shipment Risk Calculation (per M3 Spec):
    Weather 30%, Customs 25%, Route 20%, Port 15%, Cargo 10%
    """
    details = details or {}
    w_weight = 0.30
    c_weight = 0.25
    r_weight = 0.20
    p_weight = 0.15
    cg_weight = 0.10

    w_contrib = round(weather_score * w_weight, 1)
    c_contrib = round(customs_score * c_weight, 1)
    r_contrib = round(route_score * r_weight, 1)
    p_contrib = round(port_score * p_weight, 1)
    cg_contrib = round(cargo_score * cg_weight, 1)

    overall_score = round(w_contrib + c_contrib + r_contrib + p_contrib + cg_contrib)

    if overall_score <= 30:
        risk_level = "LOW"
        guidance = "Voyage risk within nominal operating parameters. Automated dispatch approved."
    elif overall_score <= 60:
        risk_level = "MEDIUM"
        guidance = "Moderate transit & compliance considerations. Standard monitoring and operational buffers advised."
    elif overall_score <= 80:
        risk_level = "HIGH"
        guidance = "Heightened multi-factor exposure. Senior broker or customs review recommended before quote release."
    else:
        risk_level = "CRITICAL"
        guidance = "Severe voyage or regulatory risk. Requires mandatory Compliance Officer approval and contingency rerouting."

    factors = [
        {
            "factor_type": "WEATHER",
            "factor_name": "Marine & Aviation Weather",
            "score": weather_score,
            "weight_pct": 30,
            "contribution_pts": w_contrib,
            "severity": "HIGH" if weather_score > 60 else ("MEDIUM" if weather_score > 30 else "LOW"),
            "reason": details.get("weather_reason", "Seasonal swell and cross-wind forecast along primary transit segment."),
            "source": "NOAA / ECMWF Satellite Ensemble"
        },
        {
            "factor_type": "CUSTOMS",
            "factor_name": "Customs & Regulatory Readiness",
            "score": customs_score,
            "weight_pct": 25,
            "contribution_pts": c_contrib,
            "severity": "HIGH" if customs_score > 60 else ("MEDIUM" if customs_score > 30 else "LOW"),
            "reason": details.get("customs_reason", "HS code classification & Advance Cargo Declaration verification requirements."),
            "source": "Customs RAG Legal Corpus & Tariff Registry"
        },
        {
            "factor_type": "ROUTE",
            "factor_name": "Route Geometry & Chokepoint Exposure",
            "score": route_score,
            "weight_pct": 20,
            "contribution_pts": r_contrib,
            "severity": "HIGH" if route_score > 60 else ("MEDIUM" if route_score > 30 else "LOW"),
            "reason": details.get("route_reason", "Passage through maritime corridor with moderate naval escort / traffic density."),
            "source": "AIS Vessel Traffic & Navigational Notices"
        },
        {
            "factor_type": "PORT",
            "factor_name": "Gateway Congestion & Dwell Time",
            "score": port_score,
            "weight_pct": 15,
            "contribution_pts": p_contrib,
            "severity": "HIGH" if port_score > 60 else ("MEDIUM" if port_score > 30 else "LOW"),
            "reason": details.get("port_reason", "Average gateway berth wait time currently 14-22 hours."),
            "source": "Port Terminal Real-Time Congestion Index"
        },
        {
            "factor_type": "CARGO",
            "factor_name": "Commodity Nature & Handling Sensitivity",
            "score": cargo_score,
            "weight_pct": 10,
            "contribution_pts": cg_contrib,
            "severity": "HIGH" if cargo_score > 60 else ("MEDIUM" if cargo_score > 30 else "LOW"),
            "reason": details.get("cargo_reason", "Standard packaged commercial cargo with standard lashing requirements."),
            "source": "Cargo Packaging & Hazmat Guidelines"
        }
    ]

    # Find primary risk driver
    top_factor = max(factors, key=lambda f: f["contribution_pts"])
    explanation = f"Primary risk driver is {top_factor['factor_name']} (contributing {top_factor['contribution_pts']} pts). {top_factor['reason']}"

    return {
        "assessment_id": f"RSK-{int(datetime.now(timezone.utc).timestamp())}",
        "overall_score": overall_score,
        "risk_level": risk_level,
        "primary_driver": top_factor["factor_name"],
        "explanation": explanation,
        "operational_guidance": guidance,
        "formula": "Weather (30%) + Customs (25%) + Route (20%) + Port (15%) + Cargo (10%)",
        "factor_breakdown": factors,
        "assessed_at": datetime.now(timezone.utc).isoformat(),
        "model_version": "rules-risk-v3.0"
    }
