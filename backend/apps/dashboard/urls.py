from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('customers/', views.CustomerListView.as_view(), name='dashboard-customers'),
    path('customers/<int:pk>/', views.CustomerDetailView.as_view(), name='dashboard-customer-detail'),
    path('orders/', views.OrderListView.as_view(), name='dashboard-orders'),
    path('orders/<int:pk>/', views.OrderDetailView.as_view(), name='dashboard-order-detail'),
    path('products/', views.ProductListView.as_view(), name='dashboard-products'),
    path('products/<int:pk>/', views.ProductDetailView.as_view(), name='dashboard-product-detail'),
    path('colors/', views.ColorListView.as_view(), name='dashboard-colors'),
    path('categories/', views.CategoryListView.as_view(), name='dashboard-categories'),
    path('categories/<int:pk>/', views.CategoryDetailView.as_view(), name='dashboard-category-detail'),
    path('data/', views.DashboardDataView.as_view(), name='dashboard-data'),
]
