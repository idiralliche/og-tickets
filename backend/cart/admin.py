from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('amount',)
    raw_id_fields = ('offer', 'olympic_event')

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'custom_user', 'amount', 'created_at', 'ordered_at')
    list_filter = ('ordered_at', 'created_at', 'custom_user')
    search_fields = ('custom_user__email', 'id')
    readonly_fields = ('amount', 'created_at', 'modified_at', 'ordered_at')
    inlines = [CartItemInline]

@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'cart', 'offer', 'olympic_event', 'quantity', 'amount')
    list_filter = ('cart', 'offer', 'olympic_event')
    search_fields = ('cart__id',)
    raw_id_fields = ('cart', 'offer', 'olympic_event')
