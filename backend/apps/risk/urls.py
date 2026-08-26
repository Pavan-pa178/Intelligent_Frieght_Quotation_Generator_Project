from django.urls import path
from .views import RiskAssessView, RiskDetailView, RiskAlertsView

urlpatterns = [
    path('assess', RiskAssessView.as_view(), name='risk_assess'),
    path('assess/', RiskAssessView.as_view(), name='risk_assess_slash'),
    path('alerts', RiskAlertsView.as_view(), name='risk_alerts'),
    path('alerts/', RiskAlertsView.as_view(), name='risk_alerts_slash'),
    path('<str:shipment_id>', RiskDetailView.as_view(), name='risk_detail'),
    path('<str:shipment_id>/', RiskDetailView.as_view(), name='risk_detail_slash'),
]
