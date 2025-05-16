"""Test module for user registration and activation workflow.

This module tests the complete user registration and account activation flow
using Djoser endpoints, verifying:
- User registration creates an inactive account
- Proper UID and token generation for activation
- Successful account activation endpoint behavior
- Actual user activation status update
"""

from django.contrib.auth.tokens import default_token_generator
from djoser.utils import encode_uid
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import CustomUser


class RegistrationActivationFlowTest(APITestCase):
    """Test case for user registration and activation workflow.

    Tests the complete flow:
    1. User registration (account should be created inactive)
    2. Activation UID and token generation
    3. Activation endpoint request
    4. Verification of account activation status

    Attributes:
        None
    """

    def test_registration_and_activation_flow(self):
        """Test complete registration and activation workflow.

        Steps:
        1. Register new user via API (should be inactive)
        2. Generate activation UID and token matching Djoser's implementation
        3. Send activation request
        4. Verify user is activated in database

        Verifies:
        - Registration returns HTTP 201
        - New user is created inactive
        - Activation returns HTTP 204
        - User is active after activation
        """
        # Endpoint URLs
        registration_url = '/api/auth/users/'
        activation_url = '/api/auth/users/activation/'

        # 1) User registration
        payload = {
            "first_name": "Test",
            "last_name": "User",
            "email": "test.user@example.com",
            "password": "Pass1234!",
            "re_password": "Pass1234!"
        }
        response = self.client.post(
            registration_url,
            payload,
            format='json'
        )
        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
            "Registration should return HTTP 201"
        )

        # Verify user is created but inactive
        user = CustomUser.objects.get(email=payload['email'])
        self.assertFalse(
            user.is_active,
            "Newly registered user should be inactive"
        )

        # 2) Generate activation credentials
        uid = encode_uid(user.pk)
        token = default_token_generator.make_token(user)

        # 3) Account activation
        activation_response = self.client.post(
            activation_url,
            {"uid": uid, "token": token},
            format='json'
        )
        self.assertEqual(
            activation_response.status_code,
            status.HTTP_204_NO_CONTENT,
            "Activation should return HTTP 204"
        )

        # 4) Verify activation
        user.refresh_from_db()
        self.assertTrue(
            user.is_active,
            "User should be active after activation"
        )
