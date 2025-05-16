"""Test module for complete JWT authentication lifecycle.

This module tests the end-to-end authentication workflow including:
- User activation after registration
- JWT token acquisition
- Token refresh mechanism
- Session termination
- Security best practices enforcement
"""

from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.tokens import default_token_generator
from djoser.utils import encode_uid
from .utils import create_test_user


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class JWTAuthFlowTest(APITestCase):
    """End-to-end test suite for JWT authentication workflow.

    Test Sequence:
    1. User activation (simulating registration flow)
    2. Successful login with credentials
    3. Access token refresh
    4. Proper logout with token invalidation

    Security Verifications:
    - Refresh tokens only transmitted via HttpOnly cookies
    - Token rotation on refresh
    - Immediate session termination on logout
    - No sensitive data exposure in responses
    """

    def setUp(self):
        """Initialize test environment with inactive user and activate it.
        
        Creates:
        - Inactive test user with known credentials
        - Valid activation tokens
        - Performs activation through API
        - Verifies successful activation
        """
        # Create inactive test user
        self.user = create_test_user(
            email='alice@example.com',
            password='Alice1234!',
            first_name='Alice',
            last_name='X',
            is_active=False  # Explicitly inactive
        )

        # Generate activation tokens matching Djoser's implementation
        uid = encode_uid(self.user.pk)
        token = default_token_generator.make_token(self.user)

        # Execute activation request
        activation_response = self.client.post(
            '/api/auth/users/activation/',
            {"uid": uid, "token": token},
            format='json'
        )

        # Verify activation succeeded
        self.assertEqual(
            activation_response.status_code,
            status.HTTP_204_NO_CONTENT,
            "User activation should return HTTP 204"
        )
        self.user.refresh_from_db()
        self.assertTrue(
            self.user.is_active,
            "User account should be active after activation"
        )

    def test_full_auth_cycle(self):
        """Execute and validate complete authentication workflow.

        Test Phases:
        1. Login: Verify credentials -> access token + refresh cookie
        2. Refresh: Use cookie -> new access token + rotated refresh cookie
        3. Logout: Invalidate tokens and clear cookies

        Security Checks:
        - Refresh token only transmitted via HttpOnly cookie
        - Token rotation on refresh requests
        - Immediate session termination
        - No sensitive data exposure
        """
        # ===== Phase 1: Login =====
        login_data = {
            "email": self.user.email,
            "password": "Alice1234!"  # Matching setup credentials
        }
        login_response = self.client.post(
            '/api/auth/jwt/create/',
            login_data,
            format='json'
        )

        # Validate login response
        self.assertEqual(
            login_response.status_code, 
            status.HTTP_200_OK,
            "Successful login should return HTTP 200"
        )
        self.assertIn(
            'access', 
            login_response.data,
            "Response must contain access token"
        )
        self.assertNotIn(
            'refresh', 
            login_response.data,
            "Refresh token should only be in HttpOnly cookie"
        )
        self.assertTrue(
            login_response.cookies.get('refreshToken'),
            "Refresh token cookie must be set"
        )
        self.assertTrue(
            login_response.cookies['refreshToken']['httponly'],
            "Refresh cookie must be HttpOnly"
        )

        # Store tokens for subsequent phases
        access_token = login_response.data['access']
        initial_refresh_token = login_response.cookies['refreshToken'].value

        # ===== Phase 2: Refresh =====
        # Set refresh token cookie for the request
        self.client.cookies.load({'refreshToken': initial_refresh_token})
        refresh_response = self.client.post(
            '/api/auth/jwt/refresh/',
            {},
            format='json'
        )

        # Validate refresh response
        self.assertEqual(
            refresh_response.status_code,
            status.HTTP_200_OK,
            "Token refresh should return HTTP 200"
        )
        self.assertIn(
            'access',
            refresh_response.data,
            "Response must contain new access token"
        )

        # Verify refresh token rotation
        new_refresh_token = refresh_response.cookies['refreshToken'].value
        self.assertNotEqual(
            new_refresh_token, 
            initial_refresh_token,
            "Refresh token must be rotated on use"
        )

        # ===== Phase 3: Logout =====
        # Set authentication context
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {access_token}'
        )
        logout_response = self.client.post(
            '/api/auth/jwt/logout/',
            format='json'
        )

        # Validate logout effects
        self.assertEqual(
            logout_response.status_code,
            status.HTTP_205_RESET_CONTENT,
            "Logout should return HTTP 205"
        )
        self.assertEqual(
            logout_response.cookies['refreshToken']['max-age'],
            0,
            "Refresh cookie must be immediately expired"
        )
        self.assertEqual(
            logout_response.cookies['refreshToken'].value,
            '',
            "Refresh cookie must be cleared"
        )
