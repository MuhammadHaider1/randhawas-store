from rest_framework import serializers
from apps.products.models import Product
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = OrderItem
        fields = ['product', 'product_name', 'product_image', 'size', 'color', 'quantity', 'price', 'discount_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    payment_receipt = serializers.ImageField(required=False, allow_null=True)
    receipt_url = serializers.ReadOnlyField(source='receipt_url')

    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'customer_name', 'customer_email',
            'customer_phone', 'customer_whatsapp', 'shipping_address',
            'city', 'notes', 'subtotal', 'discount_amount', 'total',
            'payment_method', 'payment_status', 'advance_amount', 'payment_receipt', 'receipt_url',
            'status', 'items', 'created_at'
        ]
        read_only_fields = ['order_id', 'payment_status', 'status', 'created_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order

class OrderListSerializer(serializers.ModelSerializer):
    item_count = serializers.SerializerMethodField()
    receipt_url = serializers.ReadOnlyField(source='receipt_url')

    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'customer_name', 'customer_phone',
            'total', 'payment_method', 'payment_status', 'advance_amount',
            'status', 'is_read', 'item_count', 'created_at', 'receipt_url'
        ]

    def get_item_count(self, obj):
        return obj.items.count()

class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status', 'payment_status', 'advance_amount']
