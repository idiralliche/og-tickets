from django.contrib import admin
from .models import Offer
from order.models import OrderItem
from django.db.models import Sum, Q

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'nb_place', 'total_tickets_sold', 'total_revenue')
    search_fields = ('name', 'description')
    list_editable = ('price', 'nb_place')
    ordering = ('price',)
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'price', 'nb_place')
        }),
    )

    def get_queryset(self, request):
        # Appelle le queryset original
        qs = super().get_queryset(request)
        # Annoter chaque offre avec stats des OrderItem liés à une commande 'paid'
        return qs.annotate(
            total_tickets_sold=Sum(
                'orderitem__quantity',
                filter=Q(orderitem__order__status='paid')
            ),
            total_revenue=Sum(
                'orderitem__amount',
                filter=Q(orderitem__order__status='paid')
            )
        )

    def total_tickets_sold(self, obj):
        # Peut être None si aucune vente
        return obj.total_tickets_sold or 0
    total_tickets_sold.short_description = "Billets vendus"

    def total_revenue(self, obj):
        return "{:,.2f}".format(obj.total_revenue or 0).replace(',', ' ')
    total_revenue.short_description = "Montant généré (€)"
