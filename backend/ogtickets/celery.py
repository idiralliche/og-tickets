import os
import django
from celery import Celery
from typing import Final

# 1) Configure Django settings module environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ogtickets.settings')

# 2) Initialize Django application context
django.setup()

# 3) Create Celery application instance
app: Final[Celery] = Celery('ogtickets')
app.config_from_object('django.conf:settings', namespace='CELERY')

# 4) Auto-discover asynchronous tasks in all installed apps
app.autodiscover_tasks()
