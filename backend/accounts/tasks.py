from celery import shared_task
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from djoser.utils import encode_uid
from templated_mail.mail import BaseEmailMessage
from django.contrib.auth import get_user_model

User = get_user_model()

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_activation_email_task(self, user_id):
    """Celery task for sending user activation email via Djoser.
    
    Args:
        self: The Celery task instance (auto-injected when bind=True)
        user_id: Primary key of the user to send activation email to
        
    Raises:
        self.retry: Automatically retries the task on failure (max 3 attempts)
        User.DoesNotExist: If user with given ID doesn't exist (will trigger retry)
        Exception: Any other exception will trigger retry
        
    Side Effects:
        - Sends activation email via templated_mail
        - Logs retry attempts in Celery
        
    Context Variables:
        uid: Encoded user ID for URL safety
        token: Generated activation token
        domain: From settings.FRONT_DOMAIN
        protocol: From settings.EMAIL_FRONTEND_PROTOCOL
        url: Formatted activation URL from DJOSER settings
    """
    try:
        user = User.objects.get(pk=user_id)
        uid   = encode_uid(user.pk)
        token = default_token_generator.make_token(user)
        context = {
            "user": user,
            "uid": uid,
            "token": token,
            "domain": settings.FRONT_DOMAIN,
            "protocol": settings.EMAIL_FRONTEND_PROTOCOL,
            "url": settings.DJOSER["ACTIVATION_URL"].format(uid=uid, token=token),
        }
        BaseEmailMessage(
            template_name='email/activation_email.html',
            context=context,
        ).send(
            to=[user.email],
            from_email=settings.DEFAULT_FROM_EMAIL,
            # fail_silently=False (default)
        )

    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_password_reset_email_task(self, user_id):
    """Celery task for sending password reset email.
    
    Args:
        self: The Celery task instance
        user_id: Primary key of the user requesting password reset
        
    Returns:
        None: Only sends email, no return value
        
    Raises:
        self.retry: On any failure (max 3 attempts with 60s delay)
        
    Context Variables:
        Includes all activation email variables plus:
        url: Formatted password reset URL from DJOSER settings
    """
    try:
        user = User.objects.get(pk=user_id)
        uid   = encode_uid(user.pk)
        token = default_token_generator.make_token(user)
        context = {
            "user": user,
            "uid": uid,
            "token": token,
            "domain": settings.FRONT_DOMAIN,
            "protocol": settings.EMAIL_FRONTEND_PROTOCOL,
            "url": settings.DJOSER["PASSWORD_RESET_CONFIRM_URL"].format(uid=uid, token=token),
        }
        BaseEmailMessage(
            template_name='email/password_reset_email.html',
            context=context,
        ).send(
            to=[user.email],
            from_email=settings.DEFAULT_FROM_EMAIL,
        )
    except Exception as exc:
        raise self.retry(exc=exc)

@shared_task
def send_confirmation_email_task(user_id):
    """Celery task for sending account confirmation email after activation.
    
    Args:
        user_id: Primary key of the successfully activated user
        
    Note:
        Simpler version without retry logic since activation is already confirmed
        Uses different email template than activation/password reset
        
    Template Context:
        user: The activated user instance
    """
    from templated_mail.mail import BaseEmailMessage
    user = User.objects.get(pk=user_id)

    BaseEmailMessage(
        template_name='email/confirmation_email.html',
        context={'user': user},
    ).send(
        to=[user.email],
        from_email=settings.DEFAULT_FROM_EMAIL
    )
