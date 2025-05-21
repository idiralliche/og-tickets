from django.db.models import Sum, F
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from order.models import Order, OrderItem
from order.serializers import OrderSerializer
from django.db import transaction

class CartViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations on the Cart model.
    Includes a custom `checkout` action to finalize the cart and create an order.
    """
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Retrieve the queryset of carts for the authenticated user.
        @return: QuerySet of Cart objects filtered by the current user.
        """
        return Cart.objects.filter(custom_user=self.request.user)

    def perform_create(self, serializer):
        """
        Save a new cart instance for the authenticated user.
        @param serializer: The serializer instance.
        """
        serializer.save(custom_user=self.request.user)

    @action(detail=True, methods=['post'])
    def checkout(self, request, pk=None):
        """
        Custom action to checkout a cart and create an order.
        @param request: The request object.
        @param pk: The primary key of the cart.
        @return: Response with the created order data or error message.
        """
        cart = self.get_object()
        if cart.ordered_at:
            return Response(
                {"detail": "Panier déjà validé."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_items = cart.items.all()
        if not cart_items.exists():
            return Response({"detail": "Panier vide."}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate the total amount
        total = cart.items.aggregate(
            total=Sum(F('amount') * F('quantity'))
        )['total'] or 0

        order = Order.objects.create(
            user=request.user,
            amount=total,
            status='pending'
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                offer=item.offer,
                olympic_event=item.olympic_event,
                quantity=item.quantity,
                price=item.offer.price,  # Set the price
                amount=item.amount,
            )

        cart.ordered_at = timezone.now()
        cart.amount = total
        cart.save()

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        """
        List the current open cart for the authenticated user.
        @param request: The request object.
        @return: Response with the cart data.
        """
        cart = Cart.objects.filter(
            custom_user=self.request.user,
            ordered_at__isnull=True
        ).first()

        if not cart:
            cart = Cart.objects.create(custom_user=self.request.user)

        serializer = self.get_serializer([cart], many=True)
        return Response(serializer.data)

class CartItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations on the CartItem model.
    """
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Retrieve the queryset of cart items for the current open cart of the authenticated user.
        @return: QuerySet of CartItem objects filtered by the current user's open cart.
        """
        # Show only items from the user's current "open" cart
        return CartItem.objects.filter(
            cart__custom_user=self.request.user,
            cart__ordered_at__isnull=True
        )

    def perform_create(self, serializer):
        """
        Save a new cart item instance to the current open cart of the authenticated user.
        @param serializer: The serializer instance.
        """
        # Get or create the current cart
        cart, _ = Cart.objects.get_or_create(
            custom_user=self.request.user,
            ordered_at__isnull=True
        )
        serializer.save(cart=cart)

    def update(self, request, *args, **kwargs):
        """
        Update a cart item or delete it if the quantity is set to zero.
        @param request: The request object.
        @param args: Additional arguments.
        @param kwargs: Additional keyword arguments.
        @return: Response with the updated cart item data or no content if deleted.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        quantity = request.data.get('quantity', None)
        if quantity is not None and int(quantity) == 0:
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return super().update(request, *args, **kwargs)
