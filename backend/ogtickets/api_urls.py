from django.urls import path, include
from accounts.views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    LogoutView,
    ActivationResendView, 
)

# API Endpoints
urlpatterns = [
  # Business domains
  path('olympic_events/', include('olympic_events.urls')),
  path('offers/', include('offers.urls')),

  # Authentication endpoints
  path('auth/', include([
     # Custom JWT implementation
    path('jwt/create/', CustomTokenObtainPairView.as_view(), name='jwt-create'),
    path('jwt/refresh/', CustomTokenRefreshView.as_view(), name='jwt-refresh'),
    path('jwt/logout/', LogoutView.as_view(), name='jwt-logout'),

    # Account activation
    path(
      'users/resend_activation/',
      ActivationResendView.as_view(),
      name='resend-activation'
    ),

    # Djoser built-in authentication endpoints
    path('', include('djoser.urls')),
  ]))
]
