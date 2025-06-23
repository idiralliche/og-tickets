from rest_framework import serializers
from .models import Ticket
from offers.serializers import OfferSerializer
from olympic_events.serializers import OlympicEventSerializer

class TicketListSerializer(serializers.ModelSerializer):
    offer = OfferSerializer(source='order_item.offer', read_only=True)
    olympic_event = OlympicEventSerializer(source='order_item.olympic_event', read_only=True)
    price = serializers.DecimalField(source='order_item.price', max_digits=10, decimal_places=2, read_only=True)
    nb_place = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            'id',
            'status',
            'created_at',
            'used_at',
            'nb_place',
            'offer',
            'olympic_event',
            'price',
        ]

    def get_nb_place(self, obj):
        return obj.order_item.offer.nb_place if hasattr(obj.order_item.offer, "nb_place") else None
