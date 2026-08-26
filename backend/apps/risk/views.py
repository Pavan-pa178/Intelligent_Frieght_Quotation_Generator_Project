from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .engine import calculate_composite_risk

class RiskAssessView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        w_score = float(data.get('weather_score', 28))
        c_score = float(data.get('customs_score', 32))
        r_score = float(data.get('route_score', 22))
        p_score = float(data.get('port_score', 18))
        cg_score = float(data.get('cargo_score', 12))

        res = calculate_composite_risk(w_score, c_score, r_score, p_score, cg_score, details=data)
        return Response(res, status=status.HTTP_200_OK)

class RiskDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, shipment_id=None):
        res = calculate_composite_risk(28, 32, 22, 18, 12, details={"shipment_id": shipment_id})
        res["shipment_id"] = shipment_id or "SHP-7821"
        return Response(res, status=status.HTTP_200_OK)

class RiskAlertsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        alerts = [
            {
                "id": "ALT-RSK-001",
                "category": "WEATHER",
                "severity": "HIGH",
                "title": "Severe Cyclone Alert - Bay of Bengal Sector",
                "message": "Ensemble model predicts 4.8m wave height along Chennai - Singapore corridor. Rerouting recommended.",
                "timestamp": "10 mins ago",
                "status": "ACTIVE"
            },
            {
                "id": "ALT-RSK-002",
                "category": "CUSTOMS",
                "severity": "MEDIUM",
                "title": "CE Declaration of Conformity Missing for HS 850440",
                "message": "Consignment to Rotterdam requires EU DoC document upload prior to customs release.",
                "timestamp": "42 mins ago",
                "status": "NEEDS_ACTION"
            },
            {
                "id": "ALT-RSK-003",
                "category": "PORT",
                "severity": "LOW",
                "title": "Nhava Sheva (JNPT) Terminal 4 Berth Congestion",
                "message": "Average vessel wait time +18 hrs due to weekend container crane maintenance.",
                "timestamp": "2 hours ago",
                "status": "INFORMATIONAL"
            }
        ]
        return Response({"count": len(alerts), "alerts": alerts})
