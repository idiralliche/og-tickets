import os
import django
from celery import Celery

# 1) Configure Django settings module environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ogtickets.settings')

# 2) Create Celery application instance
app = Celery('ogtickets')

# 3) Load config from Django settings, avec le préfixe CELERY_
app.config_from_object('django.conf:settings', namespace='CELERY')

# 4) Auto-discover asynchronous tasks in all installed apps
app.autodiscover_tasks()
