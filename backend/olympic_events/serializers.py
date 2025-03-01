from rest_framework import serializers
from .models import OlympicEvent

class OlympicEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = OlympicEvent
        fields = ['id', 'sport', 'name', 'description', 'date_time', 'location']  # Include necessary fields
