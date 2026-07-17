from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.OrderCreateView.as_view(), name='order-create'),
    path('track/<str:order_id>/', views.OrderTrackView.as_view(), name='order-track'),
    path('payment-accounts/', views.PaymentAccountsView.as_view(), name='payment-accounts'),
    path('tiktok-event/', views.TikTokEventView.as_view(), name='tiktok-event'),
]
