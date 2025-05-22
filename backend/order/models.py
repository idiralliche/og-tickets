from django.db import models
from django.conf import settings

class Order(models.Model):
  STATUS_CHOICES = [
    ('pending', 'En attente'),
    ('paid', 'Payée'),
    ('cancelled', 'Annulée'),
  ]
  user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
  amount = models.DecimalField(max_digits=10, decimal_places=2)
  status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
  created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
  order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
  offer = models.ForeignKey('offers.Offer', on_delete=models.CASCADE)
  olympic_event = models.ForeignKey('olympic_events.OlympicEvent', on_delete=models.CASCADE)
  quantity = models.PositiveIntegerField()
  price = models.DecimalField(max_digits=10, decimal_places=2)
  amount = models.DecimalField(max_digits=10, decimal_places=2)
