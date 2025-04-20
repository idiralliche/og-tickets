from django.apps import AppConfig

class AccountsConfig(AppConfig):
    """
    User accounts management application

    Handles user registration workflow customization:
    - Overrides default Djoser registration behavior
    - Sends activation email
    - Connects custom signal handlers
    """
    name = "accounts"

    def ready(self):
        """Connect post-registration signal handler"""
        from djoser import signals

        # Connect signal handler
        signals.user_registered.connect(self._handle_user_registration)

    def _handle_user_registration(self, user, request, **kwargs):
        """Post-registration workflow"""
        from .utils import send_activation_email

        user.is_active = False
        user.save(update_fields=['is_active'])
        send_activation_email(user)
