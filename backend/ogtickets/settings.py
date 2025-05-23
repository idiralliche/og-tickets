import os
import sentry_sdk
from datetime import timedelta
from corsheaders.defaults import default_headers

# ====================== #
#      CORE SETTINGS     #
# ====================== #

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
"""Base directory of the Django project (absolute path)."""

# Environment
ENV = os.getenv('ENV', 'dev')
"""Current environment (dev, staging, prod). Defaults to 'dev'."""

DEBUG = os.getenv('DEBUG', 'False').lower() in ['true', '1', 'yes']
"""Debug mode. Defaults to False."""

SCHEME = "https" if ENV in ["prod", "production"] else "http"
"""Protocol scheme (http/https) based on environment."""

# ====================== #
#    SECURITY SETTINGS   #
# ====================== #

SECRET_KEY = os.getenv('SECRET_KEY', 'dummy-secret-key&12345678')
"""Django secret key. Must be set in production."""

ALLOWED_HOSTS = [
    host.strip() for host in 
    os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1,[::1]').split(',')
]
"""List of allowed hostnames for security."""

CORS_ALLOWED_ORIGINS = [
    f"{SCHEME}://{host}" for host in 
    os.getenv('CORS_ALLOWED_ORIGINS', 'localhost,127.0.0.1,[::1]').split(',')
]
"""List of allowed origins for CORS."""

CORS_ALLOW_CREDENTIALS = True
"""Allow cookies in cross-origin requests."""

CORS_ALLOW_HEADERS = list(default_headers) + ['x-csrftoken']
"""Additional allowed headers for CORS requests."""

CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS.copy()
"""Origins that are trusted for CSRF purposes."""

CSRF_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = 'None'
SESSION_COOKIE_SECURE = True

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]
"""Password strength validation rules (Django defaults)."""

# ====================== #
#   MONITORING SETTINGS  #
# ====================== #

SENTRY_DSN = os.getenv('SENTRY_DSN', '')
"""Sentry DSN for error tracking. Empty string disables Sentry."""

if ENV in ['prod', 'production'] and SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        send_default_pii=True,
        traces_sample_rate=1.0,
        _experiments={"continuous_profiling_auto_start": True},
    )
    """Initialize Sentry SDK in production with full trace sampling."""

# ====================== #
#  APPLICATION CONFIG    #
# ====================== #

INSTALLED_APPS = [
    # Django core apps
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    
    # Third-party apps
    'rest_framework',
    'djoser',
    'corsheaders',
    'rest_framework_simplejwt.token_blacklist',
    
    # Project apps
    'accounts',
    'olympic_events',
    'offers',
    'cart',
    'order',
    'payment',
]
"""List of installed applications."""

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
"""Middleware stack for request/response processing."""

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, 'templates')],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

ROOT_URLCONF = "ogtickets.urls"
"""Root URL configuration for the project."""

WSGI_APPLICATION = "ogtickets.wsgi.application"
"""WSGI application entry point."""

# ====================== #
#  DATABASE SETTINGS     #
# ====================== #

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'ogtickets_db'),
        'USER': os.getenv('DB_USER', 'tixidest'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'olympics'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': int(os.getenv('DB_PORT', 5432)),
    }
}
"""PostgreSQL database configuration with environment variables."""

if ENV in ['prod', 'production']:
    DATABASES['default']['OPTIONS'] = {'sslmode': 'require'}
    """Enforce SSL connections in production environment."""


# ====================== #
#  EMAIL & NOTIFICATIONS
# ====================== #

SITE_NAME = "OG Tickets"
"""Site name used in emails."""

FRONTEND_DOMAIN = os.getenv('FRONTEND_DOMAIN', 'localhost:8080')
"""Frontend domain for email links."""

EMAIL_FRONTEND_PROTOCOL = SCHEME
"""Protocol for email links (http/https)."""

if not os.getenv('EMAIL_HOST'):
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    """Use console email backend when no SMTP host is configured."""
else:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = os.getenv('EMAIL_HOST')
    EMAIL_PORT: int = int(os.getenv("EMAIL_PORT", 587))
    EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
    EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() in ['true', '1', 'yes']
    DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL")
    """SMTP email configuration when EMAIL_HOST is set."""

# ====================== #
#  AUTHENTICATION SETTINGS
# ====================== #

AUTH_USER_MODEL = 'accounts.CustomUser'
"""Custom user model for authentication."""

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(hours=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_COOKIE': 'refreshToken',
    'AUTH_COOKIE_SECURE': True,
    'AUTH_COOKIE_HTTP_ONLY': True,
    'AUTH_COOKIE_PATH': '/api/auth/jwt/refresh/', 
    'AUTH_COOKIE_SAMESITE': 'None',
}
"""Configuration for Simple JWT authentication."""

DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'SEND_ACTIVATION_EMAIL': False,
    'ACTIVATION_URL': f"{os.getenv('USERS_ACTIVATION_ROUTE', 'acces/ouverture')}?uid={{uid}}&token={{token}}",
    'PASSWORD_RESET_CONFIRM_URL': f"{os.getenv('USERS_PASSWORD_RESET_ROUTE','acces/reprise')}?uid={{uid}}&token={{token}}",
    'PASSWORD_RESET_CONFIRM_RETYPE': True,
    'PASSWORD_RESET_SHOW_EMAIL_NOT_FOUND': False,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': True,
    'SEND_CONFIRMATION_EMAIL': False,
    'SERIALIZERS': {
        'user_create': 'accounts.serializers.CustomUserCreateSerializer',
        'user': 'accounts.serializers.CustomUserSerializer',
    },
    'EMAIL_FRONTEND_DOMAIN': FRONTEND_DOMAIN,
    'EMAIL_FRONTEND_PROTOCOL': SCHEME,
}
"""Djoser authentication configuration."""

# ====================== #
#  REST FRAMEWORK SETTINGS
# ====================== #

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}
"""REST framework configuration."""

# ====================== #
#  INTERNATIONALIZATION  #
# ====================== #

LANGUAGE_CODE = 'fr'
"""Default language code (French)."""

TIME_ZONE = "Europe/Paris"
"""Default time zone (Paris)."""

USE_I18N = True
"""Enable internationalization system."""

USE_TZ = True
"""Use timezone-aware datetimes."""

# ====================== #
#  STATIC & MEDIA FILES  #
# ====================== #

STATIC_URL = "/static/"
"""URL prefix for static files."""

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
"""Absolute path to collect static files."""

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]

# ====================== #
#  CELERY & BACKGROUND TASKS
# ====================== #

STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', 'sk_test_123:#mockedstripe!456$dummysecretkey;789')

# ====================== #
#  CELERY & BACKGROUND TASKS
# ====================== #

REDIS_URL = os.getenv('REDIS_URL', 'redis://redis:6379/0')
"""Redis connection URL with fallback to local development."""

CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', REDIS_URL)
"""Celery message broker URL."""

CELERY_TASK_ALWAYS_EAGER = os.getenv('CELERY_TASK_ALWAYS_EAGER', 'False').lower() in ['true','1','yes']
"""If True, executes tasks synchronously instead of using Celery worker. 
Useful for testing environments. Defaults to False."""

CELERY_TASK_EAGER_PROPAGATES = (
    str(os.getenv('CELERY_TASK_EAGER_PROPAGATES', str(CELERY_TASK_ALWAYS_EAGER)))
    .lower() in ['true', '1', 'yes']
)
"""If True, exceptions in eager tasks propagate immediately.
Defaults to same value as CELERY_TASK_ALWAYS_EAGER when not set.
Should typically match CELERY_TASK_ALWAYS_EAGER setting."""

CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', REDIS_URL)
"""Celery result backend URL."""

CELERY_ACCEPT_CONTENT = ['json']
"""Allowed content types for task serialization."""

CELERY_TASK_SERIALIZER = 'json'
"""Default task serializer."""

CELERY_RESULT_SERIALIZER = 'json'
"""Default result serializer."""

CELERY_TIMEZONE = TIME_ZONE
"""Celery worker timezone."""

# ====================== #
#  MISCELLANEOUS SETTINGS
# ====================== #

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
"""Default primary key field type."""
