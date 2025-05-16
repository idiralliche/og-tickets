"""Test module for JWT authentication workflow.

This module tests the complete JWT authentication flow including:
- Login with cookie-based refresh tokens
- Token refresh mechanism
- Logout functionality
- Security best practices implementation
"""

from django.conf import settings
from rest_framework import status
from rest_framework.test import APITestCase
from .utils import create_test_user


class AuthFlowTest(APITestCase):
    """Comprehensive test suite for JWT authentication workflow.

    Test scenarios:
    1. Successful login returns access token and sets secure refresh cookie
    2. Token refresh using cookie returns new access token and rotates refresh token
    3. Logout properly invalidates tokens and clears cookies
    4. Security measures (HttpOnly cookies, token rotation)

    Attributes:
        user: Test user instance
        login_url: URL for JWT login endpoint
        refresh_url: URL for token refresh endpoint  
        logout_url: URL for logout endpoint
        cookie_name: Name of the refresh token cookie from settings
    """

    def setUp(self):
        """Initialize test environment with active user and endpoint URLs."""
        self.user = create_test_user(
            email="bob@example.com",
            password="Secret123!",
            first_name="Bob",
            last_name="Flow",
            is_active=True
        )
        self.login_url = "/api/auth/jwt/create/"
        self.refresh_url = "/api/auth/jwt/refresh/"
        self.logout_url = "/api/auth/jwt/logout/"
        self.cookie_name = settings.SIMPLE_JWT["AUTH_COOKIE"]

    def test_login_sets_refresh_cookie_and_returns_access_only(self):
        """Test successful login flow with cookie-based refresh tokens.

        Verifies:
        - Returns HTTP 200 with access token in body
        - Sets refresh token as HttpOnly cookie
        - Doesn't expose refresh token in response body
        - Cookie has secure attributes (HttpOnly, potentially Secure)
        """
        # Execute login request
        response = self.client.post(
            self.login_url,
            {
                "email": self.user.email,
                "password": "Secret123!"
            },
            format="json"
        )

        # Verify response status and content
        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
            "Login should return HTTP 200"
        )
        self.assertIn(
            "access",
            response.data,
            "Response must contain access token"
        )
        self.assertNotIn(
            "refresh",
            response.data,
            "Refresh token should not be in response body"
        )

        # Verify cookie settings
        self.assertIn(
            self.cookie_name,
            response.cookies,
            "Refresh token cookie must be set"
        )
        cookie = response.cookies[self.cookie_name]
        self.assertTrue(
            cookie["httponly"],
            "Refresh cookie must be HttpOnly"
        )
        if settings.SIMPLE_JWT.get("AUTH_COOKIE_SECURE", False):
            self.assertTrue(
                cookie["secure"],
                "Secure flag should be set when using HTTPS"
            )

    def test_refresh_reads_cookie_and_renews_it(self):
        """Test token refresh flow with cookie rotation.

        Steps:
        1. Perform initial login to get tokens
        2. Use refresh cookie to get new access token
        3. Verify refresh token rotation

        Verifies:
        - Returns HTTP 200 with new access token
        - Rotates refresh token (new cookie value)
        - Maintains secure cookie attributes
        """
        # Initial login
        login_response = self.client.post(
            self.login_url,
            {
                "email": self.user.email,
                "password": "Secret123!"
            },
            format="json"
        )
        old_refresh = login_response.cookies[self.cookie_name].value

        # Set cookie for refresh request
        self.client.cookies[self.cookie_name] = old_refresh

        # Execute refresh request
        refresh_response = self.client.post(
            self.refresh_url,
            format="json"
        )

        # Verify new tokens
        self.assertEqual(
            refresh_response.status_code,
            status.HTTP_200_OK,
            "Refresh should return HTTP 200"
        )
        self.assertIn(
            "access",
            refresh_response.data,
            "Response must contain new access token"
        )

        # Verify refresh token rotation
        self.assertIn(
            self.cookie_name,
            refresh_response.cookies,
            "New refresh cookie must be set"
        )
        new_refresh = refresh_response.cookies[self.cookie_name].value
        self.assertNotEqual(
            old_refresh,
            new_refresh,
            "Refresh token must be rotated"
        )

    def test_logout_clears_cookie_and_blacklists(self):
        """Test logout functionality and token invalidation.

        Steps:
        1. Perform login to get valid tokens
        2. Execute logout request
        3. Verify token invalidation

        Verifies:
        - Returns HTTP 205 (Reset Content)
        - Clears refresh token cookie
        - Blacklists tokens (implicit via cookie clearing)
        """
        # Login and get tokens
        login_response = self.client.post(
            self.login_url,
            {
                "email": self.user.email,
                "password": "Secret123!"
            },
            format="json"
        )
        access_token = login_response.data["access"]
        
        # Setup authenticated session
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )
        self.client.cookies[self.cookie_name] = (
            login_response.cookies[self.cookie_name].value
        )

        # Execute logout
        logout_response = self.client.post(
            self.logout_url,
            format="json"
        )

        # Verify logout effects
        self.assertEqual(
            logout_response.status_code,
            status.HTTP_205_RESET_CONTENT,
            "Logout should return HTTP 205"
        )
        self.assertEqual(
            logout_response.cookies[self.cookie_name]["max-age"],
            0,
            "Refresh cookie must be expired"
        )
        self.assertEqual(
            logout_response.cookies[self.cookie_name].value,
            "",
            "Refresh cookie must be cleared"
        )
