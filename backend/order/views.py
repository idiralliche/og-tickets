from rest_framework import viewsets, permissions
from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
  """Allows authenticated users to view their odrers."""
  serializer_class = OrderSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get_queryset(self):
    # Only return orders for the authenticated user
    return Order.objects.filter(user=self.request.user)
