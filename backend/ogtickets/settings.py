import os
import sentry_sdk
from dotenv import load_dotenv

# Initialize Sentry only in production mode
if os.getenv('ENV', 'dev') in ['prod', 'production']:
    sentry_sdk.init(
        dsn=os.getenv('SENTRY_DSN', ''),
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

# Setting environment configuration
ENV = os.getenv('ENV', 'dev')

if ENV not in ['prod', 'production']:
    # Development / test environment: load from .env files
    ENV_FILEPATH = os.path.join(BASE_DIR, '.env')
    if os.path.exists(ENV_FILEPATH):
        print(ENV)
        # Load environment variables from .env file
        load_dotenv(ENV_FILEPATH, override=True)
        print(ENV)
    else:
        raise Exception(f"Missing .env file at {ENV_FILEPATH}")

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
    'corsheaders',
    'olympic_events',
    'offers',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    "django.middleware.security.SecurityMiddleware",
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
        "DIRS": [],
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
    # Default settings (you can customize as needed)
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',  # Only return JSON responses
    ],
}

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DATABASE_NAME'),
        'USER': os.getenv('DATABASE_USER'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD'),
        'HOST': os.getenv('DATABASE_HOST'),
        'PORT': int(os.getenv('DATABASE_PORT', 5432)),
        'OPTIONS': {}  # sslmode only set in production, see below
    },
}
if os.getenv('ENV', 'dev') in ['prod', 'production']:
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
LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

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
