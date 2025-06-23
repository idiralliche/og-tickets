from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db import transaction

class Order(models.Model):
  STATUS_CHOICES = [
    ('pending', 'En attente'),
    ('paid', 'Payée'),
    ('cancelled', 'Annulée'),
  ]
  user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.PROTECT,
    related_name='orders'
  )
  amount = models.DecimalField(max_digits=10, decimal_places=2)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
  created_at = models.DateTimeField(auto_now_add=True)
  paid_at = models.DateTimeField(null=True, blank=True)
  deleted_at = models.DateTimeField(null=True, blank=True) # soft-delete

  def delete(self, using=None, keep_parents=False):
    """Soft delete : mark the order as deleted instead of removing it."""
    self.deleted_at = timezone.now()
    self.save()

  def hard_delete(self, using=None, keep_parents=False):
    """Permanently delete the order."""
    super().delete(using=using, keep_parents=keep_parents)

  def mark_as_paid(self):
    """Update the order status to 'paid' and set the paid_at timestamp."""
    self.status = 'paid'
    self.paid_at = timezone.now()
    self.save(update_fields=['status', 'paid_at'])
    self.generate_tickets()

  def generate_tickets(self):
    """Create tickets for each order item."""
    from tickets.models import Ticket
    with transaction.atomic():
      for item in self.items.all():
        for i in range(item.quantity): # create a ticket for each quantity
          Ticket.objects.create(
            user=self.user,
            order_item=item,
            olympic_event=item.olympic_event,
            nb_place=item.offer.nb_place,
            status='valid',
          )

class OrderItem(models.Model):
  order = models.ForeignKey(
    Order,
    on_delete=models.PROTECT,
    related_name='items'
  )
  offer = models.ForeignKey(
    'offers.Offer',
    on_delete=models.PROTECT
  )
  olympic_event = models.ForeignKey(
    'olympic_events.OlympicEvent',
    on_delete=models.PROTECT
  )
  quantity = models.PositiveIntegerField()
  price = models.DecimalField(max_digits=10, decimal_places=2)
  amount = models.DecimalField(max_digits=10, decimal_places=2)
  deleted_at = models.DateTimeField(null=True, blank=True) # soft-delete

  def delete(self, using=None, keep_parents=False):
    """Soft delete : mark the order item as deleted instead of removing it."""
    self.deleted_at = timezone.now()
    self.save()

  def hard_delete(self, using=None, keep_parents=False):
    """Permanently delete the order item."""
    super().delete(using=using, keep_parents=keep_parents)
