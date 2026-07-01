from django.core.management.base import BaseCommand
from apps.products.models import Category

CATEGORIES = [
    {"name": "Heels", "slug": "heels", "description": "Premium heels, stilettos, wedges, and more"},
    {"name": "Bangles", "slug": "bangles", "description": "Traditional and modern bangles"},
    {"name": "Handbags", "slug": "handbags", "description": "Handbags, clutches, and totes"},
    {"name": "Suits", "slug": "suits", "description": "Stitched and unstitched suits"},
    {"name": "Shalwar Kameez", "slug": "shalwar-kameez", "description": "Classic shalwar kameez collection"},
    {"name": "Kurta Shalwar", "slug": "kurta-shalwar", "description": "Elegant kurta shalwar designs"},
    {"name": "Jewelry", "slug": "jewelry", "description": "Necklaces, earrings, rings, and more"},
    {"name": "Makeup", "slug": "makeup", "description": "Cosmetics and beauty products"},
    {"name": "Shoes", "slug": "shoes", "description": "Flats, sandals, and casual footwear"},
    {"name": "Perfumes", "slug": "perfumes", "description": "Fragrances and attars"},
    {"name": "Accessories", "slug": "accessories", "description": "Scarves, belts, and other accessories"},
]

class Command(BaseCommand):
    help = "Seed initial categories for women's fashion store"

    def handle(self, *args, **options):
        created = 0
        for data in CATEGORIES:
            _, is_new = Category.objects.get_or_create(
                slug=data["slug"],
                defaults=data,
            )
            if is_new:
                created += 1
                self.stdout.write(self.style.SUCCESS(f"Created: {data['name']}"))
        self.stdout.write(self.style.SUCCESS(f"Done — {created} new categories created"))
