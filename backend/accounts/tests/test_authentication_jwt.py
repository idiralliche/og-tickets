from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import CustomUser
from django.contrib.auth.tokens import default_token_generator
from djoser.utils import encode_uid

@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class JWTAuthFlowTest(APITestCase):
    """
    End-to-end test suite for JWT authentication flow:
    1. User activation
    2. Login with credentials
    3. Token refresh
    4. Logout
    """
    def setUp(self):
        # Create inactive user
        self.user = CustomUser.objects.create_user(
            email='alice@example.com',
            password='Alice1234!',
            first_name='Alice',
            last_name='X',
            is_active=False
        )

        # Generate activation parameters
        uid = encode_uid(self.user.pk)
        token = default_token_generator.make_token(self.user)

        # Activate user through API
        activation_response = self.client.post(
            '/api/auth/users/activation/',
            {"uid": uid, "token": token},
            format='json'
        )
        self.assertEqual(activation_response.status_code, status.HTTP_204_NO_CONTENT)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)

    def test_full_auth_cycle(self):
        """Test complete authentication workflow"""
        # Phase 1: Login with credentials
        login_data = {
            "email": self.user.email,
            "password": "Alice1234!"  # Match setup password
        }
        login_response = self.client.post(
            '/api/auth/jwt/create/',
            login_data,
            format='json'
        )

        # Validate login response
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        # should only return "access" an send "refrechToken" cookie
        self.assertIn('access', login_response.data)
        self.assertNotIn('refresh', login_response.data)
        self.assertIn('refreshToken', login_response.cookies)  # Refresh should be cookie-only
        self.assertTrue(login_response.cookies.get('refreshToken'))

        # Store tokens for next phases
        access_token = login_response.data['access']
        refresh_cookie = login_response.cookies['refreshToken'].value

        # Phase 2: Refresh access token
        self.client.cookies.load({'refreshToken': refresh_cookie})
        refresh_response = self.client.post(
            '/api/auth/jwt/refresh/',
            {},
            format='json'
        )

        # Validate refresh response
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_response.data)
        self.assertIn('refreshToken', refresh_response.cookies)
        new_refresh_cookie = refresh_response.cookies['refreshToken'].value
        self.assertNotEqual(new_refresh_cookie, refresh_cookie)  # Refresh token rotation

        # Phase 3: Logout with valid token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_response = self.client.post(
            '/api/auth/jwt/logout/',
            format='json'
        )
        
        # Validate logout response
        self.assertEqual(logout_response.status_code, status.HTTP_205_RESET_CONTENT)
        self.assertEqual(
            logout_response.cookies['refreshToken']['max-age'], 
            0, 
            "Refresh cookie should be invalidated"
        )

