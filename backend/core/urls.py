from django.contrib import admin
from django.urls import path, include
from apps.shipments.views import AgentRunStatusView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/gateways/', include('apps.masterdata.urls')),
    path('api/v1/masterdata/', include('apps.masterdata.urls')),
    path('api/v1/ports/', include('apps.masterdata.urls')),
    path('api/v1/shipments/', include('apps.shipments.urls')),
    path('api/v1/runs/<str:run_id>/', AgentRunStatusView.as_view(), name='run_status'),
    path('api/v1/quotes/', include('apps.quotes.urls')),
    path('api/v1/estimate/', include('apps.quotes.estimate_urls')),
    path('api/v1/routes/', include('apps.routing.urls')),
]
