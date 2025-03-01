from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('olympic_events/', include('olympic_events.urls')),
]
