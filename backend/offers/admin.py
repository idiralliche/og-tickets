from django.contrib import admin
from .models import Offer

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'nb_place')
    search_fields = ('name', 'description')
    list_editable = ('price', 'nb_place')
    ordering = ('price',)

    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'price', 'nb_place')
        }),
    )
