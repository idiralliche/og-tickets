"""Test module for activation email template rendering.

This module tests the complete rendering pipeline of activation emails,
verifying both the technical implementation and user-facing aspects
of the email generation workflow.
"""

import re
from django.conf import settings
from django.test import TestCase, override_settings
from templated_mail.mail import BaseEmailMessage
from types import SimpleNamespace


@override_settings(
    FRONTEND_DOMAIN='testserver',
    EMAIL_FRONTEND_PROTOCOL='http',
    DEFAULT_FROM_EMAIL='noreply@example.com',
)
class ActivationEmailRenderingTest(TestCase):
    """Comprehensive test suite for activation email template rendering.

    Tests cover:
    - HTML email generation using BaseEmailMessage
    - Context variable interpolation in templates
    - Activation link URL construction
    - Email content structure and requirements
    - Proper handling of HTML entities
    """

    def setUp(self):
        """Initialize test environment with mock data.

        Creates:
        - Mock user object with essential attributes
        - Test UID and token values
        - Complete activation URL
        - Template context dictionary
        """
        self.uid = 'MQ'  # Mock encoded user ID
        self.token = 'cpurlx-ec75b9133b2fb4bb7630abddbe6ddbb0'  # Mock activation token
        self.user = SimpleNamespace(
            first_name='Bar',
            email='foo@example.com'
        )

        # Construct test URL components
        fragment = f"acces/ouverture?uid={self.uid}&token={self.token}"
        self.full_link = f"{settings.EMAIL_FRONTEND_PROTOCOL}://{settings.FRONTEND_DOMAIN}/{fragment}"

        # Template context mimicking real-world usage
        self.context = {
            'user': self.user,
            'protocol': settings.EMAIL_FRONTEND_PROTOCOL,
            'domain': settings.FRONTEND_DOMAIN,
            'url': fragment,
        }

    def test_baseemailmessage_render(self):
        """Test activation email template rendering with BaseEmailMessage.

        Verification Steps:
        1. Initialize email message with test template
        2. Verify successful rendering
        3. Locate HTML content (primary or alternatives)
        4. Validate activation link structure
        5. Check URL parameter encoding

        Technical Aspects Verified:
        - BaseEmailMessage template rendering
        - HTML content location strategy
        - URL parameter encoding safety
        - Link construction accuracy
        """
        # Initialize and render email message
        msg = BaseEmailMessage(
            template_name='email/activation_email.html',
            context=self.context,
        )
        msg.render()

        # HTML content extraction strategy
        html_body = getattr(msg, 'html', None)
        if html_body is None and msg.alternatives:
            html_body = next(
                (content for content, mimetype in msg.alternatives 
                 if mimetype == 'text/html'),
                None
            )

        # Validate HTML content exists
        self.assertIsNotNone(
            html_body,
            "HTML content must be present in either msg.html or msg.alternatives"
        )

        # Build regex pattern for URL validation
        base_url = re.escape(
            f"{settings.EMAIL_FRONTEND_PROTOCOL}://{settings.FRONTEND_DOMAIN}/"
            f"acces/ouverture?uid={self.uid}"
        )
        url_pattern = rf'<a\s+href="[^"]*{base_url}(?:&amp;|&)token={re.escape(self.token)}"'

        # Verify activation link presence and structure
        self.assertRegex(
            html_body,
            url_pattern,
            f"Email must contain properly formatted activation link matching: {url_pattern}"
        )
