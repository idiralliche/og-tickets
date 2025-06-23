import uuid
from django.db import models
from accounts.models import CustomUser
from order.models import OrderItem
from olympic_events.models import OlympicEvent
from utils.encryption import generate_and_encrypt_key
from django.utils import timezone

class Ticket(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.PROTECT, related_name='tickets')
    order_item = models.ForeignKey(OrderItem, on_delete=models.PROTECT, related_name='tickets')
    olympic_event = models.ForeignKey(OlympicEvent, on_delete=models.PROTECT, related_name='tickets')
    nb_place = models.PositiveSmallIntegerField(help_text="Nombre de personnes autorisées par ce ticket")
    ticket_key = models.CharField(max_length=512, unique=True, help_text="AES-GCM encrypted ticket key (base64)")
    status = models.CharField(
        max_length=20,
        choices=(
            ('valid', 'Valid'),
            ('used', 'Used'),
            ('cancelled', 'Cancelled'),
            ('refunded', 'Refunded'),
        ),
        default='valid'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.ticket_key:
            self.ticket_key = generate_and_encrypt_key()
        super().save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        """Soft delete : Mark the ticket as deleted instead of removing it."""
        self.deleted_at = timezone.now()
        self.save()

    def hard_delete(self, using=None, keep_parents=False):
        """Permanent deletion"""
        super().delete(using=using, keep_parents=keep_parents)
