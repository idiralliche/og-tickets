from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Include all API endpoints under the "api/" prefix.
    # Djoser authentication endpoints (under "api/auth/" prefix).
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    # Other API endpoints
    path('api/', include('ogtickets.api_urls')),
]
