from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .model import predict_freight_price_ml, ML_MODEL_METRICS

class MLPredictRateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        dist = float(data.get('distance_nm') or data.get('distanceNm', 1205))
        weight = float(data.get('weight_kg') or data.get('grossWeightKg', 15000))
        count = int(data.get('container_count', 2))
        mode = data.get('mode', 'OCEAN').upper()
        container_type = data.get('container_type', '40HC')
        rule_price = float(data.get('rule_price') or data.get('totalAmount', 148350))

        res = predict_freight_price_ml(dist, weight, count, mode, container_type, rule_price)
        return Response(res, status=status.HTTP_200_OK)

class MLMetricsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(ML_MODEL_METRICS, status=status.HTTP_200_OK)
