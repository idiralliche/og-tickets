"""Test module for user registration email activation workflow.

This module verifies that user registration properly triggers
the activation email sending task through Celery.
"""

from unittest.mock import patch
from django.test import TransactionTestCase, override_settings


@override_settings(
    CELERY_TASK_ALWAYS_EAGER=True,
    CELERY_TASK_EAGER_PROPAGATES=True,
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
)
class UserRegistrationTriggersActivationEmailTaskTest(TransactionTestCase):
    """Test case for activation email task triggering during user registration.

    Tests that:
    - User registration successfully creates an account (HTTP 201)
    - Registration triggers the activation email task
    - The task is properly queued for execution

    Uses TransactionTestCase to ensure transaction.on_commit() hooks are executed.
    """

    def setUp(self):
        """Initialize test data and endpoints."""
        self.url = '/api/auth/users/'
        self.user_data = {
            "first_name": "Bar",
            "last_name": "Baz",
            "email": "bar.baz@example.com",
            "password": "Secret123!",
            "re_password": "Secret123!",
        }

    @patch('accounts.tasks.send_activation_email_task.delay')
    def test_registration_triggers_send_activation_email_task(self, mock_delay):
        """Test that user registration triggers activation email task.

        Verifies:
        1. Registration endpoint returns HTTP 201
        2. The send_activation_email_task is properly triggered
        3. The task is called with delay() (for Celery)

        Args:
            mock_delay: Mock of the task's delay() method
        """
        # Execute registration request
        response = self.client.post(self.url, self.user_data, format='json')
        
        # Verify successful registration
        self.assertEqual(
            response.status_code,
            201,
            "User registration should return HTTP 201"
        )

        # Verify email task was triggered
        self.assertTrue(
            mock_delay.called,
            "Activation email task should be triggered after registration"
        )
