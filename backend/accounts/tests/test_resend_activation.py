from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase
from django.core import mail
from accounts.models import CustomUser

@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class ResendActivationTest(APITestCase):
    def setUp(self):
        # creats an inactive user
        self.user = CustomUser.objects.create_user(
            email='foo@example.com',
            password='Bar12345',
            first_name='Foo',
            last_name='Bar',
            is_active=False
        )
        self.resend_url = '/api/auth/users/resend_activation/'

    def test_resend_activation_for_inactive_user(self):
        resp = self.client.post(self.resend_url, {"email": self.user.email}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        # an email should be sent
        self.assertEqual(len(mail.outbox), 1)

    def test_resend_activation_for_unknown_email(self):
        resp = self.client.post(self.resend_url, {"email": "noone@example.com"}, format='json')
        # always 204
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 0)
