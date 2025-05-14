from django.urls import path, include
from rest_framework.routers import DefaultRouter
from accounts.views import (
    CustomUserViewSet,
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    LogoutView,
)
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from typing import List, Union
from django.urls.resolvers import URLPattern, URLResolver

def get_csrf(request) -> JsonResponse:
    """CSRF token endpoint handler.
    
    Generates and sets CSRF token cookie while returning minimal JSON response.
    
    Args:
        request: HttpRequest object
        
    Returns:
        JsonResponse: Always returns {'detail': 'CSRF token set'} with:
            - CSRF cookie set via ensure_csrf_cookie decorator
            - 200 status code
            
    Security:
        Decorated with ensure_csrf_cookie to guarantee token generation
    """
    return JsonResponse({'detail': 'CSRF token set'})

router = DefaultRouter()
router.register(r'users', CustomUserViewSet, basename='users')

urlpatterns: List[Union[URLPattern, URLResolver]] = [
    # Business domains
    path('olympic_events/', include('olympic_events.urls')),
    path('offers/', include('offers.urls')),
    
    # Authentication API endpoints
    path('auth/', include([
        # JWT Authentication endpoints
        path('jwt/create/', CustomTokenObtainPairView.as_view(), name='jwt-create'),
        path('jwt/refresh/', CustomTokenRefreshView.as_view(), name='jwt-refresh'),
        path('jwt/logout/', LogoutView.as_view(), name='jwt-logout'),
        
        # Custom user management routes
        path('', include(router.urls)),
        
        # Djoser built-in authentication endpoints
        path('', include('djoser.urls')),
        
        # Security endpoints
        path('csrf/', ensure_csrf_cookie(get_csrf), name='csrf-token'),
    ]))
]
