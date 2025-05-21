from rest_framework import serializers
from .models import Cart, CartItem
from offers.models import Offer
from olympic_events.models import OlympicEvent
from offers.serializers import OfferSerializer
from olympic_events.serializers import OlympicEventSerializer

class CartItemSerializer(serializers.ModelSerializer):
  offer = OfferSerializer(read_only=True)
  offer_id = serializers.PrimaryKeyRelatedField(queryset=Offer.objects.all(), write_only=True, source='offer')
  olympic_event = OlympicEventSerializer(read_only=True)
  olympic_event_id = serializers.PrimaryKeyRelatedField(queryset=OlympicEvent.objects.all(), write_only=True, source='olympic_event')
  cart = serializers.PrimaryKeyRelatedField(read_only=True)

  class Meta:
    model = CartItem
    model = CartItem
    fields = [
      'id', 'cart',
      'offer', 'offer_id',
      'olympic_event', 'olympic_event_id',
      'quantity', 'amount'
    ]
    read_only_fields = ['id', 'cart', 'offer', 'olympic_event']

  def validate(self, data):
    offer = data.get('offer') or getattr(self.instance, 'offer', None)
    amount = data.get('amount')
    quantity = data.get('quantity') or getattr(self.instance, 'quantity', None)

    if not offer or not amount or not quantity:
      return data

    expected_amount = offer.price * quantity
    if amount != expected_amount:
      raise serializers.ValidationError({
        'amount': f"Le montant ne correspond pas au prix de l'offre actuelle ({offer.price} x {quantity} = {expected_amount} €). Merci de vérifier votre panier."
      })
    return data

class CartSerializer(serializers.ModelSerializer):
  items = CartItemSerializer(many=True, read_only=True)
  class Meta:
    model = Cart
    fields = [
      'id', 'custom_user', 'amount', 'created_at',
      'modified_at', 'ordered_at', 'items'
    ]
    read_only_fields = ['id', 'custom_user', 'created_at', 'modified_at', 'ordered_at']
