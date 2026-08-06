from django.urls import path
from .views import QuoteListCreateView, QuoteDetailView

urlpatterns = [
    path('', QuoteListCreateView.as_view(), name='quote_list_create'),
    path('<str:quote_id>/', QuoteDetailView.as_view(), name='quote_detail'),
]
