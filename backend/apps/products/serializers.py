from rest_framework import serializers
from django.db.models import Count
from .models import Category, Product, ProductImage, Review

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'alt_text']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'customer_name', 'rating', 'comment', 'image', 'created_at']

class ProductListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category_name', 'price', 'discount_percent',
            'discount_price', 'has_discount', 'primary_image', 'heel_type',
            'heel_height', 'is_in_stock', 'is_featured', 'is_coming_soon', 'sold_count', 'created_at'
        ]

    def get_primary_image(self, obj):
        img = obj.images.filter(is_primary=True).first()
        if not img:
            img = obj.images.first()
        return img.image.url if img else None

    sold_count = serializers.SerializerMethodField()

    def get_sold_count(self, obj):
        return obj.orderitem_set.filter(
            order__status__in=['confirmed', 'shipped', 'delivered']
        ).count()

class ProductDetailSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    sold_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'category', 'category_name',
            'description', 'short_description', 'price', 'discount_percent',
            'discount_price', 'has_discount', 'gender', 'heel_type',
            'heel_height', 'sizes', 'colors', 'stock_count', 'is_in_stock',
            'is_featured', 'is_coming_soon', 'sold_count', 'images', 'reviews', 'average_rating',
            'review_count', 'meta_title', 'meta_description', 'created_at', 'updated_at'
        ]

    def get_average_rating(self, obj):
        reviews = obj.reviews.filter(is_approved=True)
        if reviews.exists():
            return round(sum(r.rating for r in reviews) / reviews.count(), 1)
        return 0

    def get_review_count(self, obj):
        return obj.reviews.filter(is_approved=True).count()

    def get_sold_count(self, obj):
        return obj.orderitem_set.filter(
            order__status__in=['confirmed', 'shipped', 'delivered']
        ).count()

class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'product_count', 'is_active', 'parent', 'children']

    def get_product_count(self, obj):
        if obj.parent is None:
            child_ids = obj.children.values_list('id', flat=True)
            return Product.objects.filter(category_id__in=list(child_ids) + [obj.id], is_active=True).count()
        return obj.products.filter(is_active=True).count()

    def get_children(self, obj):
        children = obj.children.filter(is_active=True).order_by('name')
        return CategorySerializer(children, many=True).data if children.exists() else []
