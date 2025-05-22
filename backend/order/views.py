from rest_framework import viewsets, permissions
from .models import Order
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ReadOnlyModelViewSet):
  """
  Permet à l'utilisateur connecté de voir ses commandes.
  """
  serializer_class = OrderSerializer
  permission_classes = [permissions.IsAuthenticated]

  def get_queryset(self):
    # Retourne uniquement les commandes de l'utilisateur connecté
    return Order.objects.filter(user=self.request.user)
