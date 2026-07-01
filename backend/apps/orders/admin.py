from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ['product', 'product_name', 'quantity', 'price']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = ['order_id', 'customer_name', 'customer_phone', 'total', 'status', 'is_read', 'created_at']
    list_filter = ['status', 'is_read']
    search_fields = ['order_id', 'customer_name', 'customer_phone']
    readonly_fields = ['order_id', 'created_at']
