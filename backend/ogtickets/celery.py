import os
from celery import Celery

# Indique à Django de charger les settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ogtickets.settings')

app = Celery('ogtickets')

# Charge la config Celery depuis tes settings.py (sous clé CELERY_)
app.config_from_object('django.conf:settings', namespace='CELERY')

# Recherche automatiquement les tâches dans chaque app Django
app.autodiscover_tasks()

# Optionnel : log niveau info
app.conf.worker_log_format = '[%(asctime)s:%(levelname)s/%(processName)s] %(message)s'
