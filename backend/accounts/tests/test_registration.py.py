from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import CustomUser

class UserRegistrationTest(APITestCase):
    def test_register_user(self):
        """
        Test the creation of a user via the Djoser registration endpoint.
        """
        url = '/api/auth/users/'  # Default registration endpoint with Djoser
        data = {
            "first_name": "Jean",
            "last_name": "Dupont",
            "email": "jean.dupont@example.com",
            "password": "MonPass123",
            "re_password": "MonPass123"
        }
        response = self.client.post(url, data, format='json')
        # Check that registration returns the 201 Created code
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check that the user has been created and is awaiting activation (is_active=False)
        user = CustomUser.objects.get(email=data['email'])
        self.assertFalse(user.is_active, "L'utilisateur doit être inactif après inscription.")
