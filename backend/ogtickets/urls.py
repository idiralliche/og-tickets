from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Include all API endpoints under the "api/" prefix.
    path('api/', include('ogtickets.api_urls')),
]
