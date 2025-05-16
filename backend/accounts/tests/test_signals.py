from django.test import override_settings, RequestFactory
from rest_framework import status
from rest_framework.test import APITestCase
from djoser.signals import user_registered

class UserRegisteredSignalTest(APITestCase):
  """
  Vérifie que le signal `user_registered` est bien envoyé
  par Djoser lors de la création d'un nouvel utilisateur.
  """

  def setUp(self):
    # Flag et stockage du payload pour assertions
    self.signal_called = False
    self.captured_user = None
    self.captured_request = None

    # Receiver temporaire
    def _receiver(signal, user, request, **kwargs):
      self.signal_called = True
      self.captured_user = user
      self.captured_request = request

    # Connexion du receiver avec un dispatch_uid unique
    user_registered.connect(
      _receiver,
      dispatch_uid="test_user_registered_signal"
    )
    self._receiver = _receiver
    self.factory = RequestFactory()

  def tearDown(self):
    # Toujours déconnecter au tearDown
    user_registered.disconnect(
      self._receiver,
      dispatch_uid="test_user_registered_signal"
    )

  @override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    CELERY_TASK_ALWAYS_EAGER=True,
    CELERY_TASK_EAGER_PROPAGATES=True,
  )
  def test_user_registered_signal_fired(self):
    payload = {
      "first_name": "Bob",
      "last_name": "Builder",
      "email": "bob.builder@example.com",
      "password": "Pass1234!",
      "re_password": "Pass1234!"
    }

    # On appelle l'endpoint d'inscription
    resp = self.client.post('/api/auth/users/', payload, format='json')
    self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    # Vérifie que notre receiver a bien été appelé
    self.assertTrue(self.signal_called, "Le signal user_registered doit être émis")

    # Vérifie que l'utilisateur capturé porte le bon email
    self.assertIsNotNone(self.captured_user)
    self.assertEqual(self.captured_user.email, payload['email'])

    # Vérifie que la requête capturée est une HttpRequest
    self.assertIsNotNone(self.captured_request)
    self.assertTrue(hasattr(self.captured_request, 'method'))
    self.assertEqual(self.captured_request.method, 'POST')
