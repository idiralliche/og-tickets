from django.contrib.auth import get_user_model
from django.utils import timezone
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from cart.models import Cart, CartItem
from offers.models import Offer
from olympic_events.models import OlympicEvent


User = get_user_model()

class CartAPITestCase(APITestCase):
    def setUp(self):
        # Create a test user and authenticate
        self.user = User.objects.create_user(
            email='test@example.com',
            password='strong-password123'
        )
        self.client.force_authenticate(user=self.user)
        # URLs
        self.list_url = reverse('cart-list')

    def test_list_requires_authentication(self):
        # Logout to test unauthorized access
        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_creates_cart(self):
        # Initially no carts
        self.assertEqual(Cart.objects.filter(custom_user=self.user).count(), 0)
        response = self.client.post(self.list_url, {})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # One cart created
        self.assertEqual(Cart.objects.filter(custom_user=self.user).count(), 1)
        cart = Cart.objects.get(custom_user=self.user)
        self.assertIsNone(cart.amount)
        self.assertIsNone(cart.ordered_at)

    def test_checkout_creates_order_and_new_cart(self):
        # Create a cart and add items
        cart = Cart.objects.create(custom_user=self.user)
        # Create offers and events
        offer = Offer.objects.create(name='Test Offer', price=10.0)
        event = OlympicEvent.objects.create(name='Test Event', date_time=timezone.now())
        # Add items
        CartItem.objects.create(cart=cart, offer=offer, olympic_event=event, quantity=2, amount=20.0)
        # Checkout URL
        checkout_url = reverse('cart-checkout', args=[cart.pk])

        response = self.client.post(checkout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh cart
        cart.refresh_from_db()
        self.assertIsNotNone(cart.ordered_at)
        self.assertEqual(cart.amount, 40.0)

        # A new open cart should be created
        open_carts = Cart.objects.filter(custom_user=self.user, ordered_at__isnull=True)
        self.assertEqual(open_carts.count(), 1)

    def test_cannot_checkout_twice(self):
        cart = Cart.objects.create(custom_user=self.user, ordered_at='2021-01-01T00:00:00Z')
        checkout_url = reverse('cart-checkout', args=[cart.pk])
        response = self.client.post(checkout_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Panier déjà validé.', response.data.get('detail', ''))
