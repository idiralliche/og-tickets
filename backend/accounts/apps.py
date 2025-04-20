from django.apps import AppConfig
from django.conf import settings
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser
from typing import TYPE_CHECKING, Any

# Avoid circular imports
if TYPE_CHECKING:
    from django.http import HttpRequest


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

    def _handle_user_registration(self, user: AbstractUser, request: "HttpRequest", **kwargs: Any) -> None:
        """Post-registration workflow"""
        from .utils import send_activation_email

        user.is_active = False
        user.save(update_fields=['is_active'])
        send_activation_email(user)
