from django.urls import path
from .views import OlympicEventListAPIView

urlpatterns = [
    path('', OlympicEventListAPIView.as_view(), name='olympic_events_list'),
]
