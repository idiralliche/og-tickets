from django.db.models import Sum, F
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer

class CartViewSet(viewsets.ModelViewSet):
  """
  CRUD sur le panier + action `checkout`
  """
  serializer_class = CartSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    return Cart.objects.filter(custom_user=self.request.user)

  def perform_create(self, serializer):
    serializer.save(custom_user=self.request.user)

  @action(detail=True, methods=['post'])
  def checkout(self, request, pk=None):
    cart = self.get_object()
    if cart.ordered_at:
      return Response(
        {"detail": "Panier déjà validé."},
        status=status.HTTP_400_BAD_REQUEST
      )

    total = cart.items.aggregate(
      total=Sum(F('amount') * F('quantity'))
    )['total'] or 0

    cart.amount = total
    cart.ordered_at = timezone.now()
    cart.save()

    # On ouvre un nouveau panier vierge
    Cart.objects.create(custom_user=request.user)

    return Response(
      CartSerializer(cart).data,
      status=status.HTTP_200_OK
    )

class CartItemViewSet(viewsets.ModelViewSet):
  """
  CRUD des lignes de panier.
  """
  serializer_class = CartItemSerializer
  permission_classes = [IsAuthenticated]

  def get_queryset(self):
    # on ne montre que les items du panier « ouvert » de l’utilisateur
    return CartItem.objects.filter(
      cart__custom_user=self.request.user,
      cart__ordered_at__isnull=True
    )

  def perform_create(self, serializer):
    # récupère ou crée le panier en cours
    cart, _ = Cart.objects.get_or_create(
      custom_user=self.request.user,
      ordered_at__isnull=True
    )
    serializer.save(cart=cart)

