from rest_framework import generics, permissions, parsers, views
from rest_framework.response import Response
from django.conf import settings
from django.core.mail import send_mail
from .models import Order
from .serializers import OrderSerializer, OrderListSerializer, OrderStatusSerializer

class OrderCreateView(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        payment_receipt = self.request.FILES.get('payment_receipt')
        order = serializer.save(user=user, payment_receipt=payment_receipt)

        import threading
        request = self.request
        threading.Thread(target=self._send_notifications, args=(order, request), daemon=True).start()

    def _send_notifications(self, order, request):
        from django.db import close_old_connections
        close_old_connections()
        items_lines = []
        for item in order.items.all():
            img_url = ''
            if item.product_image:
                img_url = f'  Image: {item.product_image}'
            items_lines.append(
                f'  - {item.product_name} x{item.quantity} = PKR {item.price}'
                f'{img_url}'
                f'  Size: {item.size} | Color: {item.color}'
            )
        items_text = '\n'.join(items_lines)

        payment_info = ''
        if order.payment_method != 'cod':
            payment_info = f'\nPayment: {order.get_payment_method_display()}\nAdvance Amount: PKR {order.advance_amount}'
            if order.payment_receipt:
                receipt_url = request.build_absolute_uri(order.payment_receipt.url)
                payment_info += f'\nReceipt: {receipt_url}'

        admin_msg = (
            f'🛒 NEW ORDER #{order.order_id}\n'
            f'{"="*40}\n'
            f'Customer: {order.customer_name}\n'
            f'Phone: {order.customer_phone}\n'
            f'WhatsApp: {order.customer_whatsapp or "N/A"}\n'
            f'Email: {order.customer_email}\n'
            f'Address: {order.shipping_address}\n'
            f'City: {order.city}\n'
            f'Total: PKR {order.total}'
            f'{payment_info}\n'
            f'{"="*40}\n'
            f'Items:\n{items_text}'
        )

        # Email to admin
        try:
            send_mail(
                f'🛒 New Order #{order.order_id} - PKR {order.total}',
                admin_msg,
                settings.DEFAULT_FROM_EMAIL,
                [settings.ADMIN_EMAIL],
                fail_silently=True,
            )
        except Exception:
            pass

        # Customer confirmation email
        try:
            customer_msg = (
                f'Dear {order.customer_name},\n\n'
                f'Thank you for your order!\n\n'
                f'Order ID: {order.order_id}\n'
                f'Total: PKR {order.total}\n'
                f'Payment: {order.get_payment_method_display()}\n'
                f'\nPlease send 50% advance payment (PKR {order.advance_amount}) '
                f'to the account shown on our website and upload the receipt.\n'
                f'Remaining PKR {order.advance_amount} will be collected on delivery.\n\n'
                f'We will verify your payment within 24 hours.\n\n'
                f'Randahaws Heel Shoes'
            )

            send_mail(
                f'Order Confirmation - {order.order_id}',
                customer_msg,
                settings.DEFAULT_FROM_EMAIL,
                [order.customer_email],
                fail_silently=True,
            )
        except Exception:
            pass

class OrderTrackView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'order_id'

class PaymentAccountsView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response(settings.PAYMENT_ACCOUNTS)
