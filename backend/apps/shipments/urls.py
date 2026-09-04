from django.urls import path
from .views import ShipmentListCreateView, TrackingDetailView, GenerateQuoteView, AgentRunStatusView, ShipmentCancelView

urlpatterns = [
    path('', ShipmentListCreateView.as_view(), name='shipment_list_create'),
    path('track/<str:tracking_number>/', TrackingDetailView.as_view(), name='tracking_detail'),
    path('<str:tracking_number>/', TrackingDetailView.as_view(), name='shipment_detail'),
    path('<str:tracking_number>/cancel/', ShipmentCancelView.as_view(), name='shipment_cancel'),
    path('<str:shipment_id>/generate-quote/', GenerateQuoteView.as_view(), name='generate_quote'),
]
