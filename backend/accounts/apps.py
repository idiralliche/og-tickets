from django.apps import AppConfig
from djoser.signals import user_registered, user_activated

class AccountsConfig(AppConfig):
    """Django AppConfig for user account management.
    
    Handles:
    - User registration and activation signals
    - Asynchronous email delivery via Celery
    - Transaction-aware task scheduling

    Attributes:
        default_auto_field (str): Default auto field type for models (BigAutoField)
        name (str): Application name as defined in INSTALLED_APPS
    """
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):
        """Initialize application after Django setup is complete.
        
        Connects signal handlers with unique dispatch_uids to prevent duplicate signals.
        
        Signals handled:
        - user_registered: Triggered on new user registration
        - user_activated: Triggered when user activates account
        """
        user_registered.connect(
            self._on_user_registered,
            dispatch_uid="accounts_send_activation_via_celery"
        )
        user_activated.connect(
            self._on_user_activated,
            dispatch_uid="accounts_send_confirmation_via_celery"
        )

    def _on_user_registered(self, user, request, **kwargs):
        """Handle user registration signal.
        
        Args:
            user (User): Newly registered User model instance
            request (HttpRequest): Associated HTTP request
            **kwargs: Additional signal arguments
            
        Note:
            - Imports tasks locally to avoid circular imports
            - Uses transaction.on_commit to ensure data consistency
            - Tasks are executed asynchronously via Celery
        """
        from .tasks import send_activation_email_task
        from django.db import transaction

        transaction.on_commit(lambda: send_activation_email_task.delay(user.id))

    def _on_user_activated(self, user, request, **kwargs):
        """Handle user activation signal.
        
        Args:
            user (User): Activated User model instance  
            request (HttpRequest): Associated HTTP request
            **kwargs: Additional signal arguments
            
        Note:
            Executes confirmation email task immediately via Celery
        """
        from .tasks import send_confirmation_email_task
        send_confirmation_email_task.delay(user.id)
