from django.db import models
from decimal import Decimal

class Color(models.Model):
    name = models.CharField(max_length=50, unique=True)
    hex_code = models.CharField(max_length=7, default='#000000', help_text='e.g. #800020')
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = 'colors'
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    attribute_definitions = models.JSONField(default=list, blank=True, help_text='Form field definitions for products in this category')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'
        db_table = 'categories'

    def __str__(self):
        return self.name

class Product(models.Model):
    GENDER_CHOICES = [('women', 'Women'), ('men', 'Men'), ('unisex', 'Unisex')]
    HEEL_TYPES = [('stiletto', 'Stiletto'), ('block', 'Block'), ('wedge', 'Wedge'),
                  ('kitten', 'Kitten'), ('platform', 'Platform'), ('cone', 'Cone')]

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    description = models.TextField(blank=True)
    short_description = models.CharField(max_length=300, blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percent = models.IntegerField(default=0, help_text='Sale off % (0-100)')

    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='women')
    heel_type = models.CharField(max_length=20, choices=HEEL_TYPES, blank=True)
    heel_height = models.CharField(max_length=50, blank=True, help_text='e.g. 10 cm')

    sizes = models.JSONField(default=list, help_text='Available sizes e.g. ["36","37","38"]')
    colors = models.JSONField(default=list, help_text='Available colors e.g. [{"name":"Black","hex":"#000000"}]')
    attributes = models.JSONField(default=dict, blank=True, help_text='Category-specific attributes')
    stock_count = models.IntegerField(default=0)
    is_in_stock = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_coming_soon = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'products'
        indexes = [
            models.Index(fields=['-created_at']),
            models.Index(fields=['is_active', 'is_featured']),
            models.Index(fields=['category', 'is_active']),
        ]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug and self.name:
            from django.utils.text import slugify
            base = slugify(self.name)
            slug = base
            counter = 1
            while Product.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f'{base}-{counter}'
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    @property
    def discount_price(self):
        if self.discount_percent > 0:
            return round(self.price * (Decimal(1) - Decimal(self.discount_percent) / Decimal(100)), 2)
        return None

    @property
    def has_discount(self):
        return self.discount_percent > 0

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    is_primary = models.BooleanField(default=False)
    alt_text = models.CharField(max_length=200, blank=True)
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = 'product_images'
        ordering = ['sort_order']

    def __str__(self):
        return f'{self.product.name} - Image {self.sort_order}'

    @property
    def image_url(self):
        try:
            name = self.image.name
            if not name:
                return None
            if self.image.storage.exists(name):
                return self.image.url
            if not name.startswith('http') and 'cloudinary' not in name.lower():
                return f'https://res.cloudinary.com/fphi64g1/image/upload/{name}'
            return self.image.url
        except Exception:
            return None

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField(blank=True)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    image = models.ImageField(upload_to='reviews/', blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'reviews'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.customer_name} - {self.product.name} ({self.rating}★)'
