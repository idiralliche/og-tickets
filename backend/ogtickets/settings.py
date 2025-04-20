import os
import sentry_sdk
from datetime import timedelta


# *** BASE CONFIGURATION ***
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV = os.getenv('ENV', 'dev')
DEBUG = os.getenv('DEBUG', 'False').lower() in ['true', '1', 'yes']

# *** MONITORING ***
# Initialize Sentry only in production
SENTRY_DSN=os.getenv('SENTRY_DSN', '')
if ENV in ['prod', 'production'] and SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        send_default_pii=True,
        traces_sample_rate=1.0,
        _experiments={"continuous_profiling_auto_start": True},
    )

# *** SECURITY ***
SECRET_KEY = os.getenv('SECRET_KEY')
ALLOWED_HOSTS = [host.strip() for host in os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1,[::1]').split(',')]

# *** APPLICATIONS ***
INSTALLED_APPS = [
    # Django core
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'djoser',
    'corsheaders',
    'rest_framework_simplejwt.token_blacklist',

    # Project apps
    'accounts',
    'olympic_events',
    'offers',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# *** CORS ***
CORS_ALLOWED_ORIGINS = [
    f"{'https' if ENV == 'production' else 'http'}://{host}"
    for host in os.getenv('CORS_ALLOWED_ORIGINS', 'localhost,127.0.0.1,[::1]').split(',')
]
CORS_ALLOW_CREDENTIALS = True

# *** DJANGO CORE CONFIG ***
ROOT_URLCONF = "ogtickets.urls"
WSGI_APPLICATION = "ogtickets.wsgi.application"
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

# *** REST FRAMEWORK ***
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

# *** AUTHENTICATION & USER MANAGMENT ***
AUTH_USER_MODEL = 'accounts.CustomUser'
# Djoser configuration (user registration/password reset)
FRONT_BASE_URL = os.getenv('FRONT_BASE_URL')
FRONT_ACTIVATION_ROUTE = os.getenv('FRONT_ACTIVATION_ROUTE')
USERS_PASSWORD_RESET_ROUTE = os.getenv('USERS_PASSWORD_RESET_ROUTE')
DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'SEND_ACTIVATION_EMAIL': False, # Using custom email flow
    'ACTIVATION_URL': f"{FRONT_BASE_URL}{FRONT_ACTIVATION_ROUTE}?uid={{uid}}&token={{token}}",
    'PASSWORD_RESET_CONFIRM_URL': f"{FRONT_BASE_URL}{USERS_PASSWORD_RESET_ROUTE}?uid={{uid}}&token={{token}}",
    'SEND_CONFIRMATION_EMAIL': False,
    'SERIALIZERS': {
        'user_create': 'accounts.serializers.CustomUserCreateSerializer',
        'user': 'accounts.serializers.CustomUserSerializer',
    },
}
# JWT Configuration with cookie-based refresh tokens
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(hours=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_COOKIE': 'refreshToken',
    'AUTH_COOKIE_SECURE': True,
    'AUTH_COOKIE_HTTP_ONLY': True,
    'AUTH_COOKIE_PATH': '/api/auth/jwt/refresh/',
    'AUTH_COOKIE_SAMESITE': 'None' if DEBUG else 'Lax',
}

# *** EMAIL ***
if email_host := os.getenv('EMAIL_HOST'):
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = os.getenv('EMAIL_HOST')
    EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
    EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
    EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
    EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() in ['true', '1', 'yes']
    DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL')
else:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# *** DATABASE ***
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'db'),
        'PORT': int(os.getenv('DB_PORT', 5432)),
        **({'OPTIONS': {'sslmode': 'require'}} if ENV == 'production' else {})
    },
}

# *** INTERNATIONALIZATION ***
LANGUAGE_CODE = 'fr' # French UI translations
TIME_ZONE = 'Europe/Paris'
USE_I18N = True # Enable internationalization system
USE_TZ = True # Use timezone-aware datetimes

# *** STATIC FILES ***
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# *** PASSWORD VALIDATION ***
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# *** DEFAULT AUTO FIELD ***
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
