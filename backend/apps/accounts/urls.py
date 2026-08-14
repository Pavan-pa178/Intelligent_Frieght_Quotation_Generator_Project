from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LoginView, RegisterView, UserMeView, UserManagementView, UserDetailAdminView

urlpatterns = [
    path('login/', LoginView.as_view(), name='auth_login'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('refresh/', TokenRefreshView.as_view(), name='auth_refresh'),
    path('me/', UserMeView.as_view(), name='auth_me'),
    path('users/', UserManagementView.as_view(), name='auth_users'),
    path('users/<str:user_id>/', UserDetailAdminView.as_view(), name='auth_user_detail'),
]
