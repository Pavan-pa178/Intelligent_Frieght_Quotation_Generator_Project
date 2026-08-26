from django.urls import path
from .views import ExecutiveAnalyticsView

urlpatterns = [
    path('summary', ExecutiveAnalyticsView.as_view(), name='analytics_summary'),
    path('summary/', ExecutiveAnalyticsView.as_view(), name='analytics_summary_slash'),
]
