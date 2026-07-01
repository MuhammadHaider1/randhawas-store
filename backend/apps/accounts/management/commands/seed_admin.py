from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates default admin user'

    def handle(self, *args, **options):
        if User.objects.filter(username='Hira-R').exists():
            self.stdout.write(self.style.WARNING('Admin user "Hira-R" already exists'))
            return

        user = User.objects.create_superuser(
            username='Hira-R',
            email='hirarandhawa660@gmail.com',
            password='HiraRandhawastore2026'
        )
        user.is_admin_user = True
        user.save(update_fields=['is_admin_user'])
        self.stdout.write(self.style.SUCCESS('Admin user "Hira-R" created successfully'))
