import math
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from core.mongodb import get_collection
from apps.masterdata.seed_master import COLLECTION_MAP

class LiveEstimateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        mode = data.get('mode', 'OCEAN').upper()
        load_type = data.get('loadType', 'FCL').upper()
        cargo_items = data.get('cargoItems', [])
        distance_nm = float(data.get('distanceNm', 1205))
        og_code = data.get('originGateway', {}).get('code') if isinstance(data.get('originGateway'), dict) else (data.get('originGateway') or 'INMAA')
        dg_code = data.get('destGateway', {}).get('code') if isinstance(data.get('destGateway'), dict) else (data.get('destGateway') or 'SGSIN')

        # 1. Fetch Master Data from MongoDB (or fallback seed)
        rate_cards_col = get_collection('rate_cards')
        rate_cards = list(rate_cards_col.find({})) if rate_cards_col is not None else COLLECTION_MAP.get('rate_cards', [])
        margin_policies_col = get_collection('margin_policies')
        margin_policies = list(margin_policies_col.find({})) if margin_policies_col is not None else COLLECTION_MAP.get('margin_policies', [])

        # Find matching margin policy
        matched_policy = next((p for p in margin_policies if p.get('active', True) and p.get('applies_to') == (f'OCEAN_{load_type}' if mode == 'OCEAN' else mode)), None)
        if not matched_policy:
            matched_policy = next((p for p in margin_policies if p.get('active', True) and p.get('applies_to') == 'ALL'), None)
        margin_pct = (matched_policy.get('target_margin_pct', 15) / 100.0) if matched_policy else 0.15

        # Calculate actual gross weight
        gross_weight = 0.0
        for item in cargo_items:
            if item.get('package_type') == 'CONTAINER':
                gross_weight += float(item.get('gross_weight_kg', 0))
            else:
                qty = float(item.get('quantity', 1))
                w = float(item.get('weight_per_unit_kg', 0))
                gross_weight += qty * w

        base_rate = 0
        baf_pct = 0.10
        thc_amount = 0
        doc_fee = 3000

        lane_key = f"{og_code}-{dg_code}-{mode}"
        short_lane_key = f"{og_code}-{dg_code}"

        if load_type == 'FCL' or any(i.get('package_type') == 'CONTAINER' for i in cargo_items):
            container_count = sum(int(i.get('container_count', 1)) for i in cargo_items) or 1
            container_type = cargo_items[0].get('container_type', '40HC') if cargo_items else '40HC'
            units_label = f"{container_count} ? {container_type}"
            charge_basis = "Per container ? FCL"

            # Search rate cards in DB
            matched_rate = None
            for card in rate_cards:
                for r in card.get('rates', []):
                    if (r.get('lane_code') in [lane_key, short_lane_key, f"{short_lane_key}-OCEAN"]) and (r.get('container') == container_type or not r.get('container')):
                        matched_rate = r
                        break
                if matched_rate:
                    break

            if matched_rate:
                rate_per_ctr = matched_rate.get('base_rate_inr') or (matched_rate.get('base_rate_usd', 600) * 83.33)
                thc_per_ctr = matched_rate.get('thc_origin_inr') or (matched_rate.get('thc_origin_usd', 95) * 83.33)
                if matched_rate.get('baf_pct'):
                    baf_pct = matched_rate.get('baf_pct') / 100.0
                if matched_rate.get('doc_fee_inr'):
                    doc_fee = matched_rate.get('doc_fee_inr')
            else:
                type_factor = 0.70 if container_type == '20GP' else (1.15 if container_type == '45HC' else 1.0)
                rate_per_ctr = (24000 + (distance_nm * 12)) * type_factor
                thc_per_ctr = 8000

            base_rate = round(rate_per_ctr * container_count)
            baf_amount = round(base_rate * baf_pct)
            thc_amount = round(thc_per_ctr * container_count)
        elif mode == 'OCEAN' and load_type == 'LCL':
            tonnes = gross_weight / 1000.0
            cbm = sum((float(i.get('length_cm', 0)) * float(i.get('width_cm', 0)) * float(i.get('height_cm', 0)) * float(i.get('quantity', 1))) / 1000000.0 for i in cargo_items)
            rt = max(cbm, tonnes, 1.0)
            units_label = f"{rt:.1f} R/T"
            charge_basis = "Revenue tons ? LCL"
            base_rate = round(max(12000, (3200 + (distance_nm * 1.2)) * rt))
            baf_amount = round(base_rate * 0.10)
            thc_amount = round(1800 * rt)
        else:
            divisor = 6000 if mode == 'AIR' else (5000 if mode == 'EXPRESS_AIR' else 4500)
            vol_kg = sum((float(i.get('length_cm', 0)) * float(i.get('width_cm', 0)) * float(i.get('height_cm', 0)) * float(i.get('quantity', 1))) / divisor for i in cargo_items)
            chg_kg = max(gross_weight, vol_kg, 10.0)
            units_label = f"{math.ceil(chg_kg)} kg"
            charge_basis = "Chargeable weight"
            per_kg = 180 if mode == 'EXPRESS_AIR' else (110 if mode == 'AIR' else 18)
            base_rate = round(max(8000, per_kg * chg_kg))
            baf_amount = round(base_rate * 0.12)
            thc_amount = round(12 * chg_kg)

        total_cost = base_rate + baf_amount + thc_amount + doc_fee
        margin_amount = round(total_cost * margin_pct)
        final_sell_price = total_cost + margin_amount

        breakdown = [
            {'label': 'Base Freight', 'val': base_rate},
            {'label': f'BAF ({round(baf_pct * 100)}%)', 'val': baf_amount},
            {'label': 'Origin THC', 'val': thc_amount},
            {'label': 'Documentation Fee', 'val': doc_fee},
            {'label': 'Total Cost', 'val': total_cost, 'isSubtotal': True},
            {'label': f'Margin ({round(margin_pct * 100)}%)', 'val': margin_amount},
            {'label': 'Final Sell Price', 'val': final_sell_price, 'isTotal': True}
        ]

        return Response({
            'isComplete': True,
            'chargeBasis': charge_basis,
            'unitsLabel': units_label,
            'grossWeightKg': round(gross_weight),
            'mainDistanceNm': round(distance_nm),
            'transitRange': '6?10 d',
            'baseRate': base_rate,
            'bafAmount': baf_amount,
            'thcAmount': thc_amount,
            'docFee': doc_fee,
            'totalCost': total_cost,
            'marginAmount': margin_amount,
            'totalAmount': final_sell_price,
            'totalFormatted': f"? {final_sell_price:,}",
            'costBreakdown': breakdown,
            'currency': 'INR',
            'isIndicative': True
        })
