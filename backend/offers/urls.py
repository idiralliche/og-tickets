from django.urls import path
from .views import OfferListAPIView

urlpatterns = [
    path('', OfferListAPIView.as_view(), name='offers_list'),
]
