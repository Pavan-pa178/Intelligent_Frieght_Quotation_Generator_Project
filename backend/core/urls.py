from django.contrib import admin
from django.urls import path, include
from apps.shipments.views import AgentRunStatusView
from apps.masterdata.views import ContactView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/gateways/', include('apps.masterdata.urls')),
    path('api/v1/masterdata/', include('apps.masterdata.urls')),
    path('api/v1/master/', include('apps.masterdata.urls')),
    path('api/v1/ports/', include('apps.masterdata.urls')),
    path('api/v1/shipments/', include('apps.shipments.urls')),
    path('api/v1/runs/<str:run_id>/', AgentRunStatusView.as_view(), name='run_status'),
    path('api/v1/quotes/', include('apps.quotes.urls')),
    path('api/v1/estimate/', include('apps.quotes.estimate_urls')),
    path('api/v1/routes/', include('apps.routing.urls')),
    path('api/v1/contact/', ContactView.as_view(), name='contact_submit'),
    
    # Milestone 3 Intelligence & Compliance APIs
    path('api/v1/weather/', include('apps.weather.urls')),
    path('api/v1/customs/', include('apps.customs.urls')),
    path('api/v1/regulations/', include('apps.customs.urls')),
    path('api/v1/risk/', include('apps.risk.urls')),
    path('api/v1/alerts/', include('apps.risk.urls')),
    path('api/v1/ml/', include('apps.ml_pricing.urls')),
    path('api/v1/agents/', include('apps.agent_ops.urls')),
    path('api/v1/analytics/', include('apps.analytics_app.urls')),
]
