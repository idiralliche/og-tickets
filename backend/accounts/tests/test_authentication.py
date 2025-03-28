from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import CustomUser
from django.contrib.auth.tokens import default_token_generator
from djoser.utils import encode_uid

class UserAuthenticationTest(APITestCase):
    def setUp(self):
        # Create a user via the registration API
        self.registration_url = '/api/auth/users/'
        self.login_url = '/api/auth/jwt/create/'
        self.user_data = {
            "first_name": "Alice",
            "last_name": "Martin",
            "email": "alice.martin@example.com",
            "password": "AlicePass123",
            "re_password": "AlicePass123"
        }
        response = self.client.post(self.registration_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Get the user created directly via the model
        from accounts.models import CustomUser
        self.user = CustomUser.objects.get(email=self.user_data["email"])

        # Simulate the activation of the user
        uid = encode_uid(self.user.pk)
        token = default_token_generator.make_token(self.user)
        activation_url = '/api/auth/users/activation/'
        activation_response = self.client.post(activation_url, {"uid": uid, "token": token}, format='json')
        self.assertEqual(activation_response.status_code, status.HTTP_204_NO_CONTENT)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active, "L'utilisateur doit être activé après activation.")

    def test_login(self):
        data = {
            "email": self.user_data["email"],
            "password": self.user_data["password"]
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
