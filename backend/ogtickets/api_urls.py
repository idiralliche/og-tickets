from django.urls import path, include
from rest_framework.routers import DefaultRouter
from accounts.views import (
    CustomUserViewSet,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    LogoutView,
)
from typing import List, Union
from django.urls.resolvers import URLPattern, URLResolver

router = DefaultRouter()
router.register(r'users', CustomUserViewSet, basename='users')

urlpatterns: List[Union[URLPattern, URLResolver]] = [
    # Business domains
    path('olympic_events/', include('olympic_events.urls')),
    path('offers/', include('offers.urls')),
    path('cart/', include('cart.urls')),
    path('order/', include('order.urls')),
    path('payment/', include('payment.urls')),
    path('tickets/', include('tickets.urls')),
    
    # Authentication API endpoints
    path('auth/', include([
        # JWT Authentication endpoints
        path('jwt/create/', CustomTokenObtainPairView.as_view(), name='jwt-create'),
        path('jwt/refresh/', CustomTokenRefreshView.as_view(), name='jwt-refresh'),
        path('jwt/logout/', LogoutView.as_view(), name='jwt-logout'),
        
        # Djoser built-in authentication endpoints
        path('', include('djoser.urls')),
        
        # Custom user management routes
        path('', include(router.urls)),
    ]))
]
