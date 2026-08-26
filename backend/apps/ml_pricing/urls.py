from django.urls import path
from .views import MLPredictRateView, MLMetricsView

urlpatterns = [
    path('predict-rate', MLPredictRateView.as_view(), name='ml_predict_rate'),
    path('predict-rate/', MLPredictRateView.as_view(), name='ml_predict_rate_slash'),
    path('metrics', MLMetricsView.as_view(), name='ml_metrics'),
    path('metrics/', MLMetricsView.as_view(), name='ml_metrics_slash'),
]
