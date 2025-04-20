import os
import sentry_sdk
from datetime import timedelta


# BASE_DIR
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ENVIRONMENT
ENV = os.getenv('ENV', 'dev')
DEBUG = os.getenv('DEBUG', 'False').lower() in ['true', '1', 'yes']

# SENTRY (only in production)
SENTRY_DSN=os.getenv('SENTRY_DSN', '')
if ENV in ['prod', 'production'] and SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        send_default_pii=True,
        traces_sample_rate=1.0,
        _experiments={"continuous_profiling_auto_start": True},
    )

# SECRET & HOSTS
SECRET_KEY = os.getenv('SECRET_KEY')
ALLOWED_HOSTS = [host.strip() for host in os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1,[::1]').split(',')]

# APPLICATIONS
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'rest_framework',
    'djoser',
    'corsheaders',
    'rest_framework_simplejwt.token_blacklist',
    'accounts',
    'olympic_events',
    'offers',
]

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

# CORS
# include "http" or "https" scheme
scheme = "http"
if ENV in ["prod","production"] :
    scheme = "https"
CORS_ALLOWED_ORIGINS = [f"{scheme}://{host}" for host in os.getenv('CORS_ALLOWED_ORIGINS', 'localhost,127.0.0.1,[::1]').split(',')]
CORS_ALLOW_CREDENTIALS = True

# URLs
ROOT_URLCONF = "ogtickets.urls"

# TEMPLATES, WSGI
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

WSGI_APPLICATION = "ogtickets.wsgi.application"

# REST Framework
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

# Djoser
FRONT_BASE_URL = os.getenv('FRONT_BASE_URL', 'http://localhost:8080')
USERS_ACTIVATION = os.getenv('FRONT_ACTIVATION_ROUTE', '/acces/ouverture')
USERS_PASSWORD_RESET_ROUTE = os.getenv('USERS_PASSWORD_RESET_ROUTE','/acces/reprise')

DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'SEND_ACTIVATION_EMAIL': False,
    'ACTIVATION_URL': f"{FRONT_BASE_URL}{USERS_ACTIVATION}?uid={{uid}}&token={{token}}",
    'PASSWORD_RESET_CONFIRM_URL': f"{FRONT_BASE_URL}{USERS_PASSWORD_RESET_ROUTE}?uid={{uid}}&token={{token}}",
    'SEND_CONFIRMATION_EMAIL': False,
    'SERIALIZERS': {
        'user_create': 'accounts.serializers.CustomUserCreateSerializer',
        'user': 'accounts.serializers.CustomUserSerializer',
    },
}

AUTH_USER_MODEL = 'accounts.CustomUser'

# SIMPLE_JWT (with cookie settings)
if DEBUG:
    samesite = 'None'
else:
    samesite = 'Lax'

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(hours=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_COOKIE': 'refreshToken',
    'AUTH_COOKIE_SECURE': True,
    'AUTH_COOKIE_HTTP_ONLY': True, # no access to JS
    'AUTH_COOKIE_PATH': '/api/auth/jwt/refresh/', 
    'AUTH_COOKIE_SAMESITE': samesite,
}

# EMAIL (console or SMTP)
if not os.getenv('EMAIL_HOST'):
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
else:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = os.getenv('EMAIL_HOST')
    EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
    EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
    EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() in ['true', '1', 'yes']
    DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL")

# DATABASE
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'db'),
        'PORT': int(os.getenv('DB_PORT', 5432)),
    },
}
if ENV in ['prod', 'production']:
    DATABASES['default']['OPTIONS'] = {'sslmode': 'require'}

# PASSWORD VALIDATION
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# I18N
LANGUAGE_CODE = 'fr'
TIME_ZONE = "Europe/Paris"
USE_I18N = True
USE_TZ = True

#STATIC
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
