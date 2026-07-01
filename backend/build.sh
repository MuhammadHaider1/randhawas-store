#!/usr/bin/env bash
set -e

pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate --noinput
python manage.py seed_categories
echo "from django.contrib.auth import get_user_model; User=get_user_model(); user,_=User.objects.get_or_create(username='Hira-R', defaults={'is_superuser':True,'is_staff':True,'is_admin_user':True}); user.set_password('HiraRandhawastore2026'); user.is_superuser=True; user.is_staff=True; user.is_admin_user=True; user.save()" | python manage.py shell
