from django.urls import path
from .views import CustomsValidateView, CustomsSignOffView, CustomsPendingReviewsView, RegulationSearchView

urlpatterns = [
    path('validate', CustomsValidateView.as_view(), name='customs_validate'),
    path('validate/', CustomsValidateView.as_view(), name='customs_validate_slash'),
    path('sign-off', CustomsSignOffView.as_view(), name='customs_sign_off_generic'),
    path('sign-off/', CustomsSignOffView.as_view(), name='customs_sign_off_generic_slash'),
    path('<str:check_id>/sign-off', CustomsSignOffView.as_view(), name='customs_sign_off'),
    path('<str:check_id>/sign-off/', CustomsSignOffView.as_view(), name='customs_sign_off_slash'),
    path('pending-reviews', CustomsPendingReviewsView.as_view(), name='customs_pending'),
    path('pending-reviews/', CustomsPendingReviewsView.as_view(), name='customs_pending_slash'),
    path('regulations/search', RegulationSearchView.as_view(), name='regulations_search'),
    path('regulations/search/', RegulationSearchView.as_view(), name='regulations_search_slash'),
]
