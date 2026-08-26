from django.urls import path
from .views import WeatherAssessView, WeatherAlertsView

urlpatterns = [
    path('assess', WeatherAssessView.as_view(), name='weather_assess'),
    path('assess/', WeatherAssessView.as_view(), name='weather_assess_slash'),
    path('alerts', WeatherAlertsView.as_view(), name='weather_alerts'),
    path('alerts/', WeatherAlertsView.as_view(), name='weather_alerts_slash'),
]
