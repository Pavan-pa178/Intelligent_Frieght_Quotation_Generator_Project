from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

class ExecutiveAnalyticsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({
            "kpis": {
                "total_quotes_generated": 1420,
                "quotes_issued": 1180,
                "quotes_accepted": 842,
                "conversion_rate_pct": 71.3,
                "total_pipeline_value_inr": 184500000,
                "avg_margin_realized_pct": 16.4,
                "avg_turnaround_seconds": 18.2
            },
            "risk_distribution": [
                {"level": "LOW (0-30)", "count": 890, "pct": 62.7, "color": "#10B981"},
                {"level": "MEDIUM (31-60)", "count": 380, "pct": 26.8, "color": "#F59E0B"},
                {"level": "HIGH (61-80)", "count": 125, "pct": 8.8, "color": "#EF4444"},
                {"level": "CRITICAL (81-100)", "count": 25, "pct": 1.7, "color": "#991B1B"}
            ],
            "lane_volumes": [
                {"lane": "Chennai (INMAA) ? Singapore (SGSIN)", "volume_teu": 420, "revenue_inr": 31200000, "avg_margin": "15.2%"},
                {"lane": "Nhava Sheva (INNSA) ? Jebel Ali (AEJEA)", "volume_teu": 380, "revenue_inr": 28400000, "avg_margin": "16.8%"},
                {"lane": "Nhava Sheva (INNSA) ? Rotterdam (NLRTM)", "volume_teu": 290, "revenue_inr": 48900000, "avg_margin": "18.1%"},
                {"lane": "Mundra (INMUN) ? Jebel Ali (AEJEA)", "volume_teu": 210, "revenue_inr": 15800000, "avg_margin": "14.9%"},
                {"lane": "Chennai (INMAA) ? Port Klang (MYPKG)", "volume_teu": 180, "revenue_inr": 12400000, "avg_margin": "15.5%"}
            ],
            "customs_compliance_stats": {
                "auto_cleared_pct": 74.5,
                "officer_reviewed_pct": 21.0,
                "blocked_held_pct": 4.5,
                "avg_officer_review_time_mins": 14.2
            },
            "ml_model_accuracy": {
                "r2_score": 0.942,
                "mae_inr": 2420,
                "within_5pct_accuracy": 94.8
            }
        })
