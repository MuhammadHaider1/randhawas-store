from django.core.management.base import BaseCommand
from apps.products.models import Category

PARENTS = [
    {"name": "Heels", "slug": "heels", "children": [
        {"name": "Stiletto", "slug": "stiletto"},
        {"name": "Block Heel", "slug": "block-heel"},
        {"name": "Wedge", "slug": "wedge"},
        {"name": "Kitten Heel", "slug": "kitten-heel"},
        {"name": "Platform", "slug": "platform"},
        {"name": "Cone Heel", "slug": "cone-heel"},
    ]},
    {"name": "Shoes", "slug": "shoes", "children": [
        {"name": "Flats", "slug": "flats"},
        {"name": "Sandals", "slug": "sandals"},
        {"name": "Boots", "slug": "boots"},
        {"name": "Sneakers", "slug": "sneakers"},
        {"name": "Pumps", "slug": "pumps"},
    ]},
    {"name": "Bangles", "slug": "bangles", "children": [
        {"name": "Glass Bangles", "slug": "glass-bangles"},
        {"name": "Metal Bangles", "slug": "metal-bangles"},
        {"name": "Bridal Bangles", "slug": "bridal-bangles"},
        {"name": "Chooda", "slug": "chooda"},
    ]},
    {"name": "Handbags", "slug": "handbags", "children": [
        {"name": "Clutches", "slug": "clutches"},
        {"name": "Tote Bags", "slug": "tote-bags"},
        {"name": "Shoulder Bags", "slug": "shoulder-bags"},
        {"name": "Crossbody", "slug": "crossbody"},
        {"name": "Backpacks", "slug": "backpacks"},
    ]},
    {"name": "Suits", "slug": "suits", "children": [
        {"name": "Stitched Suits", "slug": "stitched-suits"},
        {"name": "Unstitched Suits", "slug": "unstitched-suits"},
        {"name": "Party Wear", "slug": "party-wear-suits"},
        {"name": "Casual Suits", "slug": "casual-suits"},
    ]},
    {"name": "Shalwar Kameez", "slug": "shalwar-kameez", "children": [
        {"name": "Casual Shalwar Kameez", "slug": "casual-shalwar-kameez"},
        {"name": "Formal Shalwar Kameez", "slug": "formal-shalwar-kameez"},
    ]},
    {"name": "Kurta Shalwar", "slug": "kurta-shalwar", "children": [
        {"name": "Cotton Kurta", "slug": "cotton-kurta"},
        {"name": "Lawn Kurta", "slug": "lawn-kurta"},
        {"name": "Embroidered Kurta", "slug": "embroidered-kurta"},
    ]},
    {"name": "Jewelry", "slug": "jewelry", "children": [
        {"name": "Necklaces", "slug": "necklaces"},
        {"name": "Earrings", "slug": "earrings"},
        {"name": "Rings", "slug": "rings"},
        {"name": "Bracelets", "slug": "bracelets"},
        {"name": "Maang Tikka", "slug": "maang-tikka"},
    ]},
    {"name": "Makeup", "slug": "makeup", "children": [
        {"name": "Lipstick", "slug": "lipstick"},
        {"name": "Foundation", "slug": "foundation"},
        {"name": "Eyeshadow", "slug": "eyeshadow"},
        {"name": "Nail Polish", "slug": "nail-polish"},
        {"name": "Skincare", "slug": "skincare"},
    ]},
    {"name": "Perfumes", "slug": "perfumes", "children": [
        {"name": "Women Perfumes", "slug": "women-perfumes"},
        {"name": "Unisex Perfumes", "slug": "unisex-perfumes"},
        {"name": "Attars", "slug": "attars"},
        {"name": "Body Sprays", "slug": "body-sprays"},
    ]},
    {"name": "Accessories", "slug": "accessories", "children": [
        {"name": "Scarves & Dupattas", "slug": "scarves-dupattas"},
        {"name": "Belts", "slug": "belts"},
        {"name": "Sunglasses", "slug": "sunglasses"},
        {"name": "Watches", "slug": "watches"},
        {"name": "Hair Accessories", "slug": "hair-accessories"},
    ]},
]

class Command(BaseCommand):
    help = "Seed hierarchical categories for women's fashion store"

    def handle(self, *args, **options):
        created_parent = 0
        created_child = 0
        for parent_data in PARENTS:
            children = parent_data.pop("children", [])
            parent, is_new = Category.objects.get_or_create(
                slug=parent_data["slug"],
                defaults={"name": parent_data["name"], "slug": parent_data["slug"]},
            )
            if is_new:
                created_parent += 1
                self.stdout.write(self.style.SUCCESS(f"Parent: {parent.name}"))
            for child_data in children:
                child_data["parent"] = parent
                _, child_new = Category.objects.get_or_create(
                    slug=child_data["slug"],
                    defaults=child_data,
                )
                if child_new:
                    created_child += 1
                    self.stdout.write(f"  Child: {child_data['name']}")
        self.stdout.write(self.style.SUCCESS(
            f"Done — {created_parent} parents + {created_child} children created"
        ))
