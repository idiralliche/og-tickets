from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import OlympicEvent
from .serializers import OlympicEventSerializer

class OlympicEventListAPIView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = OlympicEvent.objects.all()
    serializer_class = OlympicEventSerializer
