"""Test module for password reset workflow using Djoser endpoints.

Tests cover the complete password reset flow including:
- Password reset request endpoint behavior
- Email generation for valid/invalid users
- Password reset confirmation process
- Actual password change verification
"""

from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase
from django.core import mail
from django.contrib.auth.tokens import default_token_generator
from djoser.utils import encode_uid
from .utils import create_test_user


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend'
)
class PasswordResetFlowTest(APITestCase):
    """Test case for Djoser password reset functionality.

    Test scenarios:
    1. POST /reset_password/ returns 204 regardless of user existence
    2. Email is generated only for existing users (Celery eager task)
    3. UID and token generation matches Djoser implementation
    4. POST /reset_password_confirm/ returns 204 and actually changes password
    """

    def setUp(self):
        """Initialize test data and URLs."""
        self.existing_email = 'known@example.com'
        self.user = create_test_user(
            email=self.existing_email,
            password='Oldpass123!',
            is_active=True
        )
        self.user.save()
        self.request_url = '/api/auth/users/reset_password/'
        self.confirm_url = '/api/auth/users/reset_password_confirm/'

    def test_request_password_reset_always_returns_204(self):
        """Test password reset request returns 204 for any email address.
        
        Verifies that:
        - Existing email returns HTTP 204
        - Non-existing email returns HTTP 204
        - Response contains no content
        """
        # Test with existing email
        response = self.client.post(
            self.request_url,
            {'email': self.existing_email},
            format='json'
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
            "Should return 204 for existing email"
        )

        # Test with unknown email
        response = self.client.post(
            self.request_url,
            {'email': 'unknown@example.com'},
            format='json'
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
            "Should return 204 for unknown email"
        )

    def test_request_password_reset_sends_mail_only_for_existing_email(self):
        """Test email generation during password reset request.
        
        Verifies that:
        - Email is generated for existing users
        - Email contains password-related subject
        - No email is generated for unknown users
        """
        # Clear email outbox before test
        mail.outbox.clear()

        # Test with existing email
        response = self.client.post(
            self.request_url,
            {'email': self.existing_email},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(response.content, "Response should be empty")
        
        self.assertEqual(
            len(mail.outbox),
            1,
            "Exactly one email should be sent for existing user"
        )
        self.assertIn(
            'mot de passe',
            mail.outbox[0].subject.lower(),
            'Email subject should contain "mot de passe" reference'
        )

        # Test with unknown email
        mail.outbox.clear()
        response = self.client.post(
            self.request_url,
            {'email': 'unknown@example.com'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(response.content, "Response should be empty")
        self.assertEqual(
            len(mail.outbox),
            0,
            "No email should be sent for unknown user"
        )

    def test_password_reset_confirm_changes_password(self):
        """Test complete password reset confirmation workflow.
        
        Steps:
        1. Generate valid UID and token matching Djoser implementation
        2. Send confirmation request with new password
        3. Verify response status
        4. Verify password was actually changed in database
        """
        # Generate UID and token
        uid = encode_uid(self.user.pk)
        token = default_token_generator.make_token(self.user)

        # New password data
        new_password = 'Newpass456!'
        
        # Send confirmation request
        response = self.client.post(
            self.confirm_url,
            {
                'uid': uid,
                'token': token,
                'new_password': new_password,
                're_new_password': new_password,
            },
            format='json'
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
            "Should return 204 for valid confirmation"
        )

        # Verify password change in database
        self.user.refresh_from_db()
        self.assertTrue(
            self.user.check_password(new_password),
            "User password should be updated after confirmation"
        )
