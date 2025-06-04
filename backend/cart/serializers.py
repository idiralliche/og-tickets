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
        fields = [
            'id', 'cart',
            'offer', 'offer_id',
            'olympic_event', 'olympic_event_id',
            'quantity', 'amount'
        ]
        read_only_fields = ['id', 'cart', 'offer', 'olympic_event']

    def validate(self, data):
        """Additional validation for cart items."""
        cart = self.context['request'].user.carts.filter(ordered_at__isnull=True).first()
        offer = data.get('offer') or data.get('offer_id') or getattr(self.instance, 'offer', None)
        olympic_event = data.get('olympic_event') or data.get('olympic_event_id') or getattr(self.instance, 'olympic_event', None)
        quantity = data.get('quantity') or getattr(self.instance, 'quantity', None)
        amount = data.get('amount')

        if cart and offer and olympic_event:
            queryset = CartItem.objects.filter(cart=cart, offer=offer, olympic_event=olympic_event)
            if self.instance:
                queryset = queryset.exclude(pk=self.instance.pk)
            if queryset.exists():
                raise serializers.ValidationError({
                    'non_field_errors': ["unique constraint: cart, offer, olympic_event"]
                })

        if offer and quantity and amount is not None:
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
