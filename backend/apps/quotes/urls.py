from django.urls import path
from .views import (
    QuoteListCreateView,
    QuoteDetailView,
    QuoteAgentActionView,
    QuoteCustomerDecisionView,
    QuoteRouteSelectView,
    QuoteCustomsActionView,
    QuoteDocumentUploadView
)

urlpatterns = [
    path('', QuoteListCreateView.as_view(), name='quote_list_create'),
    path('<str:quote_id>/', QuoteDetailView.as_view(), name='quote_detail'),
    path('<str:quote_id>/action/', QuoteAgentActionView.as_view(), name='quote_agent_action'),
    path('<str:quote_id>/customer-decision/', QuoteCustomerDecisionView.as_view(), name='quote_customer_decision'),
    path('<str:quote_id>/select-route/', QuoteRouteSelectView.as_view(), name='quote_select_route'),
    path('<str:quote_id>/customs-action/', QuoteCustomsActionView.as_view(), name='quote_customs_action'),
    path('<str:quote_id>/upload-documents/', QuoteDocumentUploadView.as_view(), name='quote_upload_documents'),
]


