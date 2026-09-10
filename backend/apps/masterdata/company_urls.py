from django.urls import path
from .company_views import CompanyListCreateView, CompanyDetailVerifyView, CompanyAgentManagementView

urlpatterns = [
    path('', CompanyListCreateView.as_view(), name='company_list_create'),
    path('<str:company_id>/', CompanyDetailVerifyView.as_view(), name='company_detail'),
    path('<str:company_id>/verify/', CompanyDetailVerifyView.as_view(), name='company_verify'),
    path('<str:company_id>/agents/', CompanyAgentManagementView.as_view(), name='company_agents'),
]
