from django.core.management.base import BaseCommand
from apps.products.models import Category

FOOTWEAR_ATTRS = [
    {"key": "sizes", "label": "Shoe Size", "type": "select_multiple", "options": ["35","36","37","38","39","40","41","42"]},
    {"key": "heel_type", "label": "Heel Type", "type": "select", "options": ["Stiletto","Block","Wedge","Kitten","Platform","Cone","Flat","Sandal","Boot"]},
    {"key": "heel_height", "label": "Heel Height", "type": "text", "placeholder": "e.g. 10 cm"},
]
BANGLES_ATTRS = [
    {"key": "sizes", "label": "Size", "type": "select_multiple", "options": ["Small (2.2\")","Medium (2.4\")","Large (2.6\")","Extra Large (2.8\")"]},
    {"key": "material", "label": "Material", "type": "select", "options": ["Glass","Metal","Gold Plated","Silver","Acrylic","Brass","Kundan"]},
]
BAGS_ATTRS = [
    {"key": "bag_type", "label": "Bag Type", "type": "select", "options": ["Clutch","Tote","Shoulder","Crossbody","Backpack","Sling","Wallet","Hobo"]},
    {"key": "material", "label": "Material", "type": "select", "options": ["Leather","Synthetic","Canvas","Fabric","Jute","Woven"]},
]
CLOTHING_ATTRS = [
    {"key": "sizes", "label": "Size", "type": "select_multiple", "options": ["S","M","L","XL","2XL","3XL"]},
    {"key": "fabric", "label": "Fabric", "type": "select", "options": ["Cotton","Lawn","Silk","Chiffon","Velvet","Linen","Net","Organza","Jacquard"]},
    {"key": "stitching", "label": "Stitching", "type": "select", "options": ["Stitched","Unstitched","Semi-Stitched"]},
]
JEWELRY_ATTRS = [
    {"key": "material", "label": "Material", "type": "select", "options": ["Gold","Silver","Gold Plated","Silver Plated","Artificial","Kundan","Polki","Stone","Bridal"]},
    {"key": "weight", "label": "Weight", "type": "text", "placeholder": "e.g. 10g"},
]
MAKEUP_ATTRS = [
    {"key": "shade", "label": "Shade/Color", "type": "text", "placeholder": "e.g. Ruby Red"},
    {"key": "volume", "label": "Volume/Size", "type": "text", "placeholder": "e.g. 50ml, 10g"},
]
PERFUMES_ATTRS = [
    {"key": "volume", "label": "Volume", "type": "select", "options": ["15ml","30ml","50ml","75ml","100ml","125ml"]},
    {"key": "fragrance_type", "label": "Type", "type": "select", "options": ["Eau de Parfum","Eau de Toilette","Attar","Body Spray","Roll-on","Perfume Oil"]},
]
ACCESSORIES_ATTRS = [
    {"key": "material", "label": "Material", "type": "select", "options": ["Fabric","Metal","Leather","Plastic","Gold Plated","Silver","Beaded","Stone"]},
    {"key": "size", "label": "Size", "type": "select", "options": ["One Size","S","M","L","XL"]},
]

PARENTS = [
    {"name": "Heels", "slug": "heels", "attribute_definitions": FOOTWEAR_ATTRS, "children": [
        {"name": "Stiletto", "slug": "stiletto"},
        {"name": "Block Heel", "slug": "block-heel"},
        {"name": "Wedge", "slug": "wedge"},
        {"name": "Kitten Heel", "slug": "kitten-heel"},
        {"name": "Platform", "slug": "platform"},
        {"name": "Cone Heel", "slug": "cone-heel"},
    ]},
    {"name": "Shoes", "slug": "shoes", "attribute_definitions": FOOTWEAR_ATTRS, "children": [
        {"name": "Flats", "slug": "flats"},
        {"name": "Sandals", "slug": "sandals"},
        {"name": "Boots", "slug": "boots"},
        {"name": "Sneakers", "slug": "sneakers"},
        {"name": "Pumps", "slug": "pumps"},
    ]},
    {"name": "Bangles", "slug": "bangles", "attribute_definitions": BANGLES_ATTRS, "children": [
        {"name": "Glass Bangles", "slug": "glass-bangles"},
        {"name": "Metal Bangles", "slug": "metal-bangles"},
        {"name": "Bridal Bangles", "slug": "bridal-bangles"},
        {"name": "Chooda", "slug": "chooda"},
    ]},
    {"name": "Handbags", "slug": "handbags", "attribute_definitions": BAGS_ATTRS, "children": [
        {"name": "Clutches", "slug": "clutches"},
        {"name": "Tote Bags", "slug": "tote-bags"},
        {"name": "Shoulder Bags", "slug": "shoulder-bags"},
        {"name": "Crossbody", "slug": "crossbody"},
        {"name": "Backpacks", "slug": "backpacks"},
    ]},
    {"name": "Suits", "slug": "suits", "attribute_definitions": CLOTHING_ATTRS, "children": [
        {"name": "Stitched Suits", "slug": "stitched-suits"},
        {"name": "Unstitched Suits", "slug": "unstitched-suits"},
        {"name": "Party Wear", "slug": "party-wear-suits"},
        {"name": "Casual Suits", "slug": "casual-suits"},
    ]},
    {"name": "Shalwar Kameez", "slug": "shalwar-kameez", "attribute_definitions": CLOTHING_ATTRS, "children": [
        {"name": "Casual Shalwar Kameez", "slug": "casual-shalwar-kameez"},
        {"name": "Formal Shalwar Kameez", "slug": "formal-shalwar-kameez"},
    ]},
    {"name": "Kurta Shalwar", "slug": "kurta-shalwar", "attribute_definitions": CLOTHING_ATTRS, "children": [
        {"name": "Cotton Kurta", "slug": "cotton-kurta"},
        {"name": "Lawn Kurta", "slug": "lawn-kurta"},
        {"name": "Embroidered Kurta", "slug": "embroidered-kurta"},
    ]},
    {"name": "Jewelry", "slug": "jewelry", "attribute_definitions": JEWELRY_ATTRS, "children": [
        {"name": "Necklaces", "slug": "necklaces"},
        {"name": "Earrings", "slug": "earrings"},
        {"name": "Rings", "slug": "rings"},
        {"name": "Bracelets", "slug": "bracelets"},
        {"name": "Maang Tikka", "slug": "maang-tikka"},
    ]},
    {"name": "Makeup", "slug": "makeup", "attribute_definitions": MAKEUP_ATTRS, "children": [
        {"name": "Lipstick", "slug": "lipstick"},
        {"name": "Foundation", "slug": "foundation"},
        {"name": "Eyeshadow", "slug": "eyeshadow"},
        {"name": "Nail Polish", "slug": "nail-polish"},
        {"name": "Skincare", "slug": "skincare"},
    ]},
    {"name": "Perfumes", "slug": "perfumes", "attribute_definitions": PERFUMES_ATTRS, "children": [
        {"name": "Women Perfumes", "slug": "women-perfumes"},
        {"name": "Unisex Perfumes", "slug": "unisex-perfumes"},
        {"name": "Attars", "slug": "attars"},
        {"name": "Body Sprays", "slug": "body-sprays"},
    ]},
    {"name": "Accessories", "slug": "accessories", "attribute_definitions": ACCESSORIES_ATTRS, "children": [
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
            attrs = parent_data.pop("attribute_definitions", [])
            parent, is_new = Category.objects.get_or_create(
                slug=parent_data["slug"],
                defaults={**parent_data, "attribute_definitions": attrs},
            )
            if not is_new and attrs:
                parent.attribute_definitions = attrs
                parent.save(update_fields=["attribute_definitions"])
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
