from rest_framework import serializers
from .models import Cart, CartItem

class CartItemSerializer(serializers.ModelSerializer):
  class Meta:
    model = CartItem
    fields = ['id', 'offer', 'olympic_event', 'quantity', 'amount']

class CartSerializer(serializers.ModelSerializer):
  items = CartItemSerializer(many=True, read_only=True)
  class Meta:
    model = Cart
    fields = [
      'id', 'custom_user', 'amount', 'created_at',
      'modified_at', 'ordered_at', 'items'
    ]
    read_only_fields = ['id', 'custom_user', 'created_at', 'modified_at', 'ordered_at']
