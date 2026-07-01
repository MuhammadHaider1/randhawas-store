from django.shortcuts import get_object_or_404
from rest_framework import generics, filters, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, Review
from .serializers import (
    CategorySerializer, ProductListSerializer,
    ProductDetailSerializer, ReviewSerializer
)

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('images')
    serializer_class = ProductListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = {
        'category': ['exact'],
        'heel_type': ['exact'],
        'heel_height': ['exact'],
        'is_featured': ['exact'],
        'is_coming_soon': ['exact'],
        'price': ['range', 'gte', 'lte'],
        'discount_percent': ['gte'],
    }
    search_fields = ['name', 'description', 'short_description']
    ordering_fields = ['price', '-created_at', 'name']
    ordering = ['-created_at']

class FeaturedProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True, is_featured=True).select_related('category').prefetch_related('images')
    serializer_class = ProductListSerializer

class ComingSoonListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True, is_coming_soon=True).select_related('category').prefetch_related('images')
    serializer_class = ProductListSerializer

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True).prefetch_related('images', 'reviews')
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'

class ReviewCreateView(generics.CreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        product = get_object_or_404(
            Product, slug=self.kwargs['slug'], is_active=True
        )
        serializer.save(product=product)
