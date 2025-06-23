from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'amount', 'status', 'created_at', 'paid_at', 'deleted_at']
    list_filter = ['status', 'created_at', 'paid_at']
    search_fields = ['user__email']
    date_hierarchy = 'created_at'
    inlines = [OrderItemInline]

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'offer', 'olympic_event', 'quantity', 'amount', 'deleted_at']
    list_filter = ['offer', 'olympic_event']
    search_fields = ['offer__name', 'olympic_event__name']
