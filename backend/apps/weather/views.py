from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .services import sample_weather_along_route, WEATHER_HOTSPOTS

class WeatherAssessView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        origin = data.get('origin_code') or data.get('originGateway', {}).get('code') or 'INMAA'
        destination = data.get('dest_code') or data.get('destGateway', {}).get('code') or 'SGSIN'
        mode = data.get('mode', 'OCEAN').upper()
        
        result = sample_weather_along_route(origin, destination, mode)
        return Response(result, status=status.HTTP_200_OK)

class WeatherAlertsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        alerts = []
        for i, s in enumerate(WEATHER_HOTSPOTS):
            alerts.append({
                "id": f"WTR-LIVE-{i+1}",
                "zone_name": s["name"],
                "type": s["type"],
                "severity": s["severity"],
                "coordinates": [s["lat"], s["lon"]],
                "wave_height_m": s["wave_height"],
                "wind_speed_kts": s["wind_speed"],
                "status": "ACTIVE_MONITORING"
            })
        return Response({"count": len(alerts), "alerts": alerts})
