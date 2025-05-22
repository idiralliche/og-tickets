from rest_framework import serializers
from .models import Order, OrderItem
from offers.serializers import OfferSerializer
from olympic_events.serializers import OlympicEventSerializer

class OrderItemSerializer(serializers.ModelSerializer):
  offer = OfferSerializer(read_only=True)
  olympic_event = OlympicEventSerializer(read_only=True)

  class Meta:
    model = OrderItem
    fields = ['id', 'offer', 'olympic_event', 'quantity', 'price', 'amount']

class OrderSerializer(serializers.ModelSerializer):
  items = OrderItemSerializer(many=True, read_only=True)
  user = serializers.StringRelatedField(read_only=True)

  class Meta:
    model = Order
    fields = ['id', 'user', 'amount', 'status', 'created_at', 'items']
