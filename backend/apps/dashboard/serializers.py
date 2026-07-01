from rest_framework import serializers
from django.db import models
from apps.accounts.models import User
from apps.products.models import Product, Category, ProductImage, Color
from apps.orders.models import Order
from apps.orders.serializers import OrderItemSerializer

class CustomerSerializer(serializers.ModelSerializer):
    order_count = serializers.SerializerMethodField()
    total_spent = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'whatsapp', 'is_active',
                  'date_joined', 'last_login', 'order_count', 'total_spent']
        read_only_fields = ['order_count', 'total_spent']

    def get_order_count(self, obj):
        return Order.objects.filter(
            models.Q(user=obj) | models.Q(customer_email=obj.email)
        ).count()

    def get_total_spent(self, obj):
        total = Order.objects.filter(
            models.Q(user=obj) | models.Q(customer_email=obj.email)
        ).aggregate(s=models.Sum('total'))['s']
        return float(total) if total else 0

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'is_active']

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = ['id', 'name', 'hex_code', 'sort_order']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'alt_text', 'sort_order']

class AdminProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first()
        if not img:
            img = obj.images.first()
        return img.image.url if img else None

class AdminOrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['order_id', 'created_at']
