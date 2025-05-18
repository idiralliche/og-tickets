from django.db import models
from django.conf import settings

class Cart(models.Model):
  custom_user = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name='carts'
  )
  amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  modified_at = models.DateTimeField(auto_now=True)
  ordered_at = models.DateTimeField(null=True, blank=True)

  def __str__(self):
    status = '✓' if self.ordered_at else '•'
    return f"{status} Panier #{self.pk} pour {self.user}"


class CartItem(models.Model):
  cart = models.ForeignKey(
    Cart,
    on_delete=models.CASCADE,
    related_name='items'
  )
  offer = models.ForeignKey('offers.Offer', on_delete=models.CASCADE)
  olympic_event = models.ForeignKey('olympic_events.OlympicEvent', on_delete=models.CASCADE)
  quantity = models.PositiveIntegerField(default=1)
  amount = models.DecimalField(max_digits=10, decimal_places=2)

  class Meta:
    unique_together = [['cart', 'offer', 'olympic_event']]

  def __str__(self):
    return f"{self.quantity} x {self.offer} in Cart #{self.cart.pk}"
