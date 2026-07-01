from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True)
    whatsapp = models.CharField(max_length=20, blank=True)
    is_admin_user = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        'auth.Group', verbose_name='groups', blank=True,
        related_name='custom_user_set', related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', verbose_name='user permissions', blank=True,
        related_name='custom_user_set', related_query_name='custom_user',
    )

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.email or self.username
