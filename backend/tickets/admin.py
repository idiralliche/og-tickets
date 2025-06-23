
from django.contrib import admin
from .models import Ticket

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'order_item',
        'olympic_event',
        'nb_place',
        'status',
        'ticket_key',
        'created_at',
        'used_at',
    )
    list_filter = ('status', 'olympic_event')
    search_fields = ('user__email', 'order_item__order__id', 'ticket_key')
    readonly_fields = ('created_at', 'used_at', 'ticket_key')
    ordering = ('-created_at',)

    def user_email(self, obj):
        return obj.user.email
    user_email.admin_order_field = 'user__email'
    user_email.short_description = 'Utilisateur'

    def event_name(self, obj):
        return obj.olympic_event.name
    event_name.admin_order_field = 'olympic_event__name'
    event_name.short_description = 'Épreuve'
