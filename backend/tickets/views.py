from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Ticket
from .serializers import TicketListSerializer
from utils.encryption import generate_ticket_hmac

class TicketViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Ticket.objects.all()
        return Ticket.objects.filter(user=user)

    @action(detail=True, methods=['get'], url_path='qr')
    def qr(self, request, pk=None):
        ticket = self.get_object()
        # Verify if the user is allowed to access the ticket
        if not request.user.is_staff and ticket.user != request.user:
            return Response({'detail': "Accès interdit."}, status=403)
        hmac_val = generate_ticket_hmac(ticket)
        return Response({
            "ticket_id": str(ticket.id),
            "hmac": hmac_val
        })
