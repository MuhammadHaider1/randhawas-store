from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.CategoryListView.as_view(), name='categories'),
    path('', views.ProductListView.as_view(), name='products'),
    path('featured/', views.FeaturedProductListView.as_view(), name='products-featured'),
    path('coming-soon/', views.ComingSoonListView.as_view(), name='products-coming-soon'),
    path('<slug:slug>/', views.ProductDetailView.as_view(), name='product-detail'),
    path('<slug:slug>/reviews/', views.ReviewCreateView.as_view(), name='product-reviews'),
]
