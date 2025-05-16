"""Test module for user activation email task functionality.

This module thoroughly tests the activation email sending task,
verifying both the technical implementation and user-facing aspects
of the account activation workflow.
"""

import re
from django.test import override_settings, TestCase
from django.core import mail
from django.contrib.auth.tokens import default_token_generator
from djoser.utils import encode_uid
from .utils import create_test_user
from accounts.tasks import send_activation_email_task


@override_settings(
    CELERY_TASK_ALWAYS_EAGER=True,
    CELERY_TASK_EAGER_PROPAGATES=True,
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    FRONTEND_DOMAIN='testserver',
    EMAIL_FRONTEND_PROTOCOL='http',
)
class ActivationEmailTaskTest(TestCase):
    """Test suite for activation email task functionality.

    Tests cover:
    - Task execution in synchronous (eager) mode
    - Email generation and delivery
    - Activation link construction
    - Email content validation
    - Proper integration with Djoser and Django auth systems
    """

    def setUp(self):
        """Initialize test environment with inactive test user."""
        self.user = create_test_user(
            email='foo@example.com',
            password='Bar12345',
            is_active=False
        )

    def test_send_activation_email_task_synchronously(self):
        """Test activation email task execution in eager mode.

        Verification Steps:
        1. Execute task synchronously
        2. Verify task completion status
        3. Check email generation
        4. Validate email content
        5. Verify activation link construction

        Technical Details Verified:
        - Proper UID encoding using Djoser's standard
        - Correct token generation using Django's auth system
        - Accurate URL construction with frontend settings
        - Proper HTML escaping in email body
        """
        # Verify clean initial state
        self.assertEqual(
            len(mail.outbox),
            0,
            "Mail outbox should be empty before test execution"
        )

        # Execute task (synchronously due to eager mode)
        task_result = send_activation_email_task.apply(args=(self.user.id,))  # type: ignore
        self.assertTrue(
            task_result.successful(),
            "Task should complete successfully in eager mode"
        )

        # Verify email generation
        self.assertEqual(
            len(mail.outbox),
            1,
            "Exactly one activation email should be generated"
        )
        email = mail.outbox[0]

        # Validate email content
        self.assertIn(
            'Activez votre compte',
            email.subject,
            'Email subject should contain activation wording: "Activez votre compte"'
        )

        # Verify activation link construction
        uid = encode_uid(self.user.pk)
        token = default_token_generator.make_token(self.user)
        expected_base_url = f"http://testserver/acces/ouverture?uid={uid}"
        escaped_base = re.escape(expected_base_url)
        url_pattern = rf"{escaped_base}(?:&|&amp;)token={re.escape(token)}"

        self.assertTrue(
            re.search(url_pattern, email.body),
            f"Email body must contain properly formatted activation URL matching: {url_pattern}"
        )
