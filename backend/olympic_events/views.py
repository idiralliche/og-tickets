from rest_framework import generics
from .models import OlympicEvent
from .serializers import OlympicEventSerializer

class OlympicEventListAPIView(generics.ListAPIView):
    # GET /olympic_events/
    queryset = OlympicEvent.objects.all()
    serializer_class = OlympicEventSerializer
