from rest_framework import generics, permissions, views, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.db.models import Sum, Count, Q
from apps.orders.models import Order
from apps.products.models import Product, Category, ProductImage, Color
from apps.accounts.models import User
from apps.orders.serializers import OrderListSerializer, OrderSerializer, OrderStatusSerializer
from .serializers import CustomerSerializer, AdminProductSerializer, CategorySerializer, AdminOrderSerializer, ColorSerializer

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and (request.user.is_staff or request.user.is_admin_user))

class DashboardStatsView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status='pending').count()
        total_revenue = Order.objects.aggregate(s=Sum('total'))['s'] or 0
        total_products = Product.objects.filter(is_active=True).count()
        total_customers = User.objects.filter(is_superuser=False, is_staff=False).count()

        top_products = (
            Product.objects.filter(orderitem__order__status__in=['confirmed', 'shipped', 'delivered'])
            .annotate(sold=Count('orderitem'))
            .order_by('-sold')[:5]
            .values('name', 'sold')
        )

        recent_orders = Order.objects.order_by('-created_at')[:5]
        orders_data = OrderListSerializer(recent_orders, many=True).data

        advance_orders = Order.objects.filter(~Q(payment_method='cod')).count()
        pending_verification = Order.objects.filter(payment_method__in=['advance_easypaisa', 'advance_bank'], payment_status='received').count()

        pending_payment_orders = Order.objects.filter(
            payment_method__in=['advance_easypaisa', 'advance_bank'],
            payment_status__in=['pending', 'received']
        ).prefetch_related('items').order_by('-created_at')
        pending_payment_data = AdminOrderSerializer(pending_payment_orders, many=True, context={'request': request}).data

        return Response({
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'total_revenue': total_revenue,
            'total_products': total_products,
            'total_customers': total_customers,
            'advance_orders': advance_orders,
            'pending_verification': pending_verification,
            'top_products': top_products,
            'recent_orders': orders_data,
            'pending_payment_orders': pending_payment_data,
        })

class CustomerListView(generics.ListAPIView):
    queryset = User.objects.filter(is_superuser=False).order_by('-date_joined')
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAdminUser]

class CustomerDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAdminUser]

class OrderListView(generics.ListAPIView):
    queryset = Order.objects.all().prefetch_related('items').order_by('-created_at')
    serializer_class = OrderListSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ['status', 'payment_method', 'payment_status']

    def get_queryset(self):
        qs = super().get_queryset()
        payment_method = self.request.query_params.get('payment_method')
        payment_status = self.request.query_params.get('payment_status')
        if payment_method:
            qs = qs.filter(payment_method=payment_method)
        if payment_status:
            qs = qs.filter(payment_status=payment_status)
        return qs

class OrderDetailView(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.all()
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        return Response(AdminOrderSerializer(instance).data)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = OrderStatusSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        receipt = request.FILES.get('payment_receipt')
        if receipt:
            instance.payment_receipt = receipt
            instance.save(update_fields=['payment_receipt'])

        return Response(AdminOrderSerializer(instance).data)

class ProductListView(generics.ListCreateAPIView):
    queryset = Product.objects.all().select_related('category').prefetch_related('images').order_by('-created_at')
    serializer_class = AdminProductSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        product = serializer.save()
        images = self.request.FILES.getlist('images')
        for idx, img in enumerate(images):
            ProductImage.objects.create(product=product, image=img, is_primary=(idx == 0), sort_order=idx)

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all().select_related('category').prefetch_related('images')
    serializer_class = AdminProductSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_update(self, serializer):
        product = serializer.save()
        images = self.request.FILES.getlist('images')
        for idx, img in enumerate(images):
            is_primary = idx == 0 and not product.images.filter(is_primary=True).exists()
            ProductImage.objects.create(product=product, image=img, is_primary=is_primary, sort_order=product.images.count() + idx)

class ColorListView(generics.ListCreateAPIView):
    queryset = Color.objects.all()
    serializer_class = ColorSerializer
    permission_classes = [permissions.IsAdminUser]

class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]

class DashboardDataView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        orders = Order.objects.all().prefetch_related('items').order_by('-created_at')
        products = Product.objects.all().select_related('category').prefetch_related('images').order_by('-created_at')
        customers = User.objects.filter(is_superuser=False).order_by('-date_joined')

        return Response({
            'orders': AdminOrderSerializer(orders, many=True).data,
            'products': AdminProductSerializer(products, many=True).data,
            'customers': CustomerSerializer(customers, many=True).data,
        })
