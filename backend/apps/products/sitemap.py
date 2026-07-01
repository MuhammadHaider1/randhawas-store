from django.http import HttpResponse
from django.urls import reverse
from django.utils import timezone
from .models import Category, Product

def sitemap_view(request):
    lines = []
    lines.append('<?xml version="1.0" encoding="UTF-8"?>')
    lines.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    now = timezone.now().date().isoformat()
    site = 'https://randhawas-store.vercel.app'

    pages = [
        ('/', '0.9', 'daily'),
        ('/shop', '0.8', 'daily'),
        ('/about', '0.5', 'monthly'),
        ('/contact', '0.5', 'monthly'),
    ]
    for path, priority, changefreq in pages:
        lines.append('  <url>')
        lines.append(f'    <loc>{site}{path}</loc>')
        lines.append(f'    <lastmod>{now}</lastmod>')
        lines.append(f'    <changefreq>{changefreq}</changefreq>')
        lines.append(f'    <priority>{priority}</priority>')
        lines.append('  </url>')

    seen = set()
    for cat in Category.objects.filter(is_active=True):
        slug = cat.parent.slug if cat.parent else cat.slug
        if slug in seen:
            continue
        seen.add(slug)
        lines.append('  <url>')
        lines.append(f'    <loc>{site}/shop/{slug}</loc>')
        lines.append(f'    <lastmod>{now}</lastmod>')
        lines.append(f'    <changefreq>weekly</changefreq>')
        lines.append(f'    <priority>0.7</priority>')
        lines.append('  </url>')

    for product in Product.objects.filter(is_active=True):
        lines.append('  <url>')
        lines.append(f'    <loc>{site}/product/{product.slug}</loc>')
        lines.append(f'    <lastmod>{product.updated_at.date().isoformat()}</lastmod>')
        lines.append(f'    <changefreq>weekly</changefreq>')
        lines.append(f'    <priority>0.6</priority>')
        lines.append('  </url>')

    lines.append('</urlset>')
    return HttpResponse('\n'.join(lines), content_type='application/xml')
