from django.test import override_settings
from django.contrib.auth.tokens import default_token_generator
from rest_framework import status
from rest_framework.test import APITestCase
from djoser.utils import encode_uid
from accounts.models import CustomUser
from django.core import mail
import re

@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    DJOSER={'ACTIVATION_URL': 'http://testserver/acces/ouverture?uid={uid}&token={token}'}
)
class UserActivationTest(APITestCase):
    def setUp(self):
        # Create the user via the registration API
        self.registration_url = '/api/auth/users/'
        self.activation_url = '/api/auth/users/activation/'
        self.user_data = {
            "first_name": "Jean",
            "last_name": "Dupont",
            "email": "jean.dupont@example.com",
            "password": "Passw0rd!",
            "re_password": "Passw0rd!"
        }
        response = self.client.post(self.registration_url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.user = CustomUser.objects.get(email=self.user_data['email'])
        self.assertFalse(self.user.is_active, "L'utilisateur doit être inactif après inscription.")
        # Retrieve the link in the email
        self.assertEqual(len(mail.outbox), 1)
        body = mail.outbox[0].body

        m = re.search(r'uid=([^&]+)&token=([\w\-]+)', body)
        self.assertIsNotNone(m, body)
        self.uid, self.token = m.group(1), m.group(2)

    def test_activate_user(self):
        resp = self.client.post(
            self.activation_url,
            {"uid": self.uid, "token": self.token},
            format='json'
        )
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)
