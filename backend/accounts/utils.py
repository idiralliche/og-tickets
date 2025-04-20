from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from typing import TYPE_CHECKING

if TYPE_CHECKING:
  from django.contrib.auth.models import AbstractUser

def send_activation_email(user: "AbstractUser") -> None:
  """
  Generate and send account activation email

  Args:
    user (User): User instance requiring activation
  """
  # Generate activation token components
  uid = urlsafe_base64_encode(force_bytes(user.pk))
  token = default_token_generator.make_token(user)
  activation_url = settings.DJOSER['ACTIVATION_URL'].format(uid=uid, token=token)

   # Prepare email content
  email_content = _build_email_content(activation_url)

  # Create and send email
  email = EmailMultiAlternatives(
    subject="Activez votre compte Olympic Games Tickets",
    body=email_content['text'],
    from_email=settings.DEFAULT_FROM_EMAIL,
    to=[user.email]
  )
  email.attach_alternative(email_content['html'], "text/html")
  email.send(fail_silently=False)


def _build_email_content(activation_url: str) -> dict[str, str]:
  """Constructs text and HTML email templates"""
  text_content = f"""\
  Bonjour,

  Merci de vous être inscrit·e ! Pour activer votre compte, copiez-collez ce lien :
  {activation_url}

  — L'équipe Olympic Games Tickets
  """

  html_content = f"""\
  <p>Bonjour,</p>
  <p>Merci de vous être inscrit·e ! Pour activer votre compte, cliquez sur le lien ci‑dessous :</p>
  <p><a href="{activation_url}">{activation_url}</a></p>
  <p>— L'équipe <strong>Olympic Games Tickets</strong></p>
  """

  return {
    'text': text_content,
    'html': html_content
  }
