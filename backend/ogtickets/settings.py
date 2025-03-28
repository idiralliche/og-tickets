import os
import sentry_sdk
from dotenv import load_dotenv

# Setting environment configuration
ENV = os.getenv('ENV', 'dev')

# Initialize Sentry only in production mode
SENTRY_DSN=os.getenv('SENTRY_DSN', '')
if ENV in ['prod', 'production'] and SENTRY_DSN:
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        # Add data like request headers and IP for users,
        # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
        send_default_pii=True,
        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for tracing.
        traces_sample_rate=1.0,
        _experiments={
            # Set continuous_profiling_auto_start to True
            # to automatically start the profiler on when
            # possible.
            "continuous_profiling_auto_start": True,
        },
    )

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

if ENV == 'test':
    ENV_TEST_FILEPATH = os.path.join(BASE_DIR, '.env.test')
    # ".env.test" file is required for testing
    if os.path.exists(ENV_TEST_FILEPATH):
        load_dotenv(ENV_TEST_FILEPATH, override=True)
    else: 
        raise Exception(f"Missing .env.test file at {ENV_TEST_FILEPATH}")
else:
    # Production environment: expect secrets to be provided via environment variables
    # No .env file is loaded
    pass

SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'False').lower() in ['true', '1', 'yes']
# Set ALLOWED_HOSTS from the environment variable; default to 'localhost,127.0.0.1,[::1]' to allow local IPv4 and IPv6.
ALLOWED_HOSTS = [host.strip() for host in os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1,[::1]').split(',')]

# Application definition
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
    'olympic_events',
    'offers',
    'accounts',
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

# CORS : Transform ALLOWED_HOSTS to include "http" or "https" scheme
scheme = "http"
if ENV in ["prod","production"] :
    scheme = "https"

CORS_ALLOWED_ORIGINS = [f"{scheme}://{host}" for host in ALLOWED_HOSTS]

ROOT_URLCONF = "ogtickets.urls"

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

# REST Framework settings
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

# DJOSER settings
DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'SEND_ACTIVATION_EMAIL': True,
    'ACTIVATION_URL': 'api/auth/users/activation/{uid}/{token}',
    'PASSWORD_RESET_CONFIRM_URL': 'api/auth/users/reset_password/{uid}/{token}',
    'SEND_CONFIRMATION_EMAIL': False,
    'SERIALIZERS': {
        'user_create': 'accounts.serializers.CustomUserCreateSerializer',
        'user': 'accounts.serializers.CustomUserSerializer',
    }
}

AUTH_USER_MODEL = 'accounts.CustomUser'

# Email settings

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




# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DATABASE_NAME'),
        'USER': os.getenv('DATABASE_USER'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD'),
        'HOST': os.getenv('DATABASE_HOST', 'db'),
        'PORT': int(os.getenv('DATABASE_PORT', 5432)),
        'OPTIONS': {}  # sslmode only set in production, see below
    },
}
if ENV in ['prod', 'production']:
    DATABASES['default']['OPTIONS']['sslmode'] = 'require'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/
LANGUAGE_CODE = 'fr'

TIME_ZONE = "Europe/Paris"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/
STATIC_URL = "/static/"
# Directory where collectstatic will gather all static files.
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
