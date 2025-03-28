from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Offer
from .serializers import OfferSerializer

class OfferListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = Offer.objects.all()
    serializer_class = OfferSerializer
