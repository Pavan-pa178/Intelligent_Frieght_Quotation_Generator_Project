from django.urls import path
from .views import GatewaySearchView, ContainerTypesView
from .congestion_views import PortCongestionView
from .master_views import MasterOverviewView, MasterSeedView, MasterCollectionCRUDView

urlpatterns = [
    # Gateway search and port congestion (public / pricing helpers)
    path('search/', GatewaySearchView.as_view(), name='gateway_search'),
    path('container-types/', ContainerTypesView.as_view(), name='container_types'),
    path('congestion/', PortCongestionView.as_view(), name='port_congestion'),

    # Admin Master Database endpoints
    path('overview/', MasterOverviewView.as_view(), name='master_overview'),
    path('seed/', MasterSeedView.as_view(), name='master_seed'),
    path('<str:collection_name>/', MasterCollectionCRUDView.as_view(), name='master_collection_list_create'),
    path('<str:collection_name>/<str:doc_id>/', MasterCollectionCRUDView.as_view(), name='master_collection_detail'),
]
