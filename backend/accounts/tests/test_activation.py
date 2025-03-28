from django.contrib.auth.tokens import default_token_generator
from rest_framework import status
from rest_framework.test import APITestCase
from djoser.utils import encode_uid
from accounts.models import CustomUser

class UserActivationTest(APITestCase):
    def setUp(self):
        # Create the user via the registration API
        self.registration_url = '/api/auth/users/'
        self.activation_url = '/api/auth/users/activation/'
        self.user_data = {
            "first_name": "Jean",
            "last_name": "Dupont",
            "email": "jean.dupont@example.com",
            "password": "MonPass123",
            "re_password": "MonPass123"
        }
        response = self.client.post(self.registration_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.user = CustomUser.objects.get(email=self.user_data['email'])
        self.assertFalse(self.user.is_active, "L'utilisateur doit être inactif après inscription.")

        def test_activate_user(self):
            uid = encode_uid(self.user.pk)
            token = default_token_generator.make_token(self.user)
            data = {"uid": uid, "token": token}
            response = self.client.post(self.activation_url, data, format='json')
            self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT,
                            f"Erreur d'activation : {response.content}")
            self.user.refresh_from_db()
            self.assertTrue(self.user.is_active, "L'utilisateur doit être activé après l'appel à l'API d'activation.")
