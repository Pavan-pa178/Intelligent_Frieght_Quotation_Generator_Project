from django.urls import path
from .views import AgentHealthView

urlpatterns = [
    path('health', AgentHealthView.as_view(), name='agent_health'),
    path('health/', AgentHealthView.as_view(), name='agent_health_slash'),
]
