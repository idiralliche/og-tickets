from django.core.management.base import BaseCommand
from order.models import OrderItem
from tickets.models import Ticket
from django.db import transaction, IntegrityError

class Command(BaseCommand):
  help = "Génère tous les tickets manquants pour les OrderItems payés (avec toutes les infos et la clé chiffrée)."

  def handle(self, *args, **options):
    created_count = 0
    skipped_count = 0
    with transaction.atomic():
      paid_items = OrderItem.objects.filter(order__status='paid')
      for item in paid_items:
        expected = item.quantity
        existing = Ticket.objects.filter(order_item=item).count()
        missing = expected - existing
        if missing > 0:
          for _ in range(missing):
            try:
              ticket = Ticket.objects.create(
                user=item.order.user,
                order_item=item,
                olympic_event=item.olympic_event,
                nb_place=getattr(item.offer, "nb_place", 1),
                status='valid',
              )
              created_count += 1
            except IntegrityError:
              skipped_count += 1

    if created_count == 0:
      self.stdout.write(self.style.SUCCESS(
        "Aucun ticket manquant trouvé. Tous les billets sont déjà générés."
      ))
    else:
      self.stdout.write(self.style.SUCCESS(
        f"{created_count} tickets générés pour les commandes déjà payées. ({skipped_count} ignorés pour duplicata éventuel)"
      ))
