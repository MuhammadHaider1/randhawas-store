from django.core.management.base import BaseCommand
from apps.orders.tiktok import send_tiktok_event


class Command(BaseCommand):
    help = 'Send a test event to TikTok Events API'

    def handle(self, *args, **options):
        result = send_tiktok_event('CompletePayment', {
            'properties': {
                'contents': [{'content_id': 'test_001', 'content_name': 'Test Product', 'content_type': 'product', 'quantity': 1}],
                'currency': 'PKR',
                'value': 500,
            }
        })
        if result:
            self.stdout.write(self.style.SUCCESS(f'TikTok response: {result}'))
        else:
            self.stdout.write(self.style.ERROR('Failed to send event'))
