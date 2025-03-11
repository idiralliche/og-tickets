from django.urls import path, include

urlpatterns = [
    # Include the olympic_events endpoints without the 'api/' prefix here.
    path('olympic_events/', include('olympic_events.urls')),
    # Include the offers endpoints without the 'api/' prefix here.
    path('offers/', include('offers.urls')),
]