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
    """
    Test case for the Cart API endpoints.
    Tests CRUD operations and custom actions on the Cart and CartItem models.
    """
    def setUp(self):
        """
        Set up the test environment with a user, authentication, and URLs.
        """
        self.user = User.objects.create_user(
            email='test@example.com',
            password='strong-password123'
        )
        self.client.force_authenticate(user=self.user)
        self.list_url = reverse('cart-list')

    def test_list_requires_authentication(self):
        """
        Test that listing carts requires authentication.
        """
        self.client.force_authenticate(user=None)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_creates_cart(self):
        """
        Test that posting to the cart list URL creates a new cart.
        """
        self.assertEqual(Cart.objects.filter(custom_user=self.user).count(), 0)
        response = self.client.post(self.list_url, {})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Cart.objects.filter(custom_user=self.user).count(), 1)
        cart = Cart.objects.get(custom_user=self.user)
        self.assertIsNone(cart.amount)
        self.assertIsNone(cart.ordered_at)

    def test_add_cart_item(self):
        """
        Test adding a cart item to a cart.
        """
        cart = Cart.objects.create(custom_user=self.user)
        offer = Offer.objects.create(name='Offre 1', price=15)
        event = OlympicEvent.objects.create(name='Event 1', date_time=timezone.now())

        url = reverse('cart-item-list')
        payload = {
            'offer_id': offer.id,
            'olympic_event_id': event.id,
            'quantity': 3,
            'amount': 45,
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        item = CartItem.objects.get(cart=cart, offer=offer, olympic_event=event)
        self.assertEqual(item.quantity, 3)
        self.assertEqual(float(item.amount), 45.0)

    def test_update_cart_item_quantity(self):
        """
        Test updating the quantity of a cart item.
        """
        cart = Cart.objects.create(custom_user=self.user)
        offer = Offer.objects.create(name='Offre 2', price=20)
        event = OlympicEvent.objects.create(name='Event 2', date_time=timezone.now())
        item = CartItem.objects.create(cart=cart, offer=offer, olympic_event=event, quantity=1, amount=20)

        url = reverse('cart-item-detail', args=[item.pk])
        # PATCH with the correct amount
        response = self.client.patch(url, {'quantity': 4, 'amount': 80}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        item.refresh_from_db()
        self.assertEqual(item.quantity, 4)
        self.assertEqual(float(item.amount), 80.0)

    def test_remove_cart_item(self):
        """
        Test removing a cart item from a cart.
        """
        cart = Cart.objects.create(custom_user=self.user)
        offer = Offer.objects.create(name='Suppression', price=12)
        event = OlympicEvent.objects.create(name='Suppression', date_time=timezone.now())
        item = CartItem.objects.create(cart=cart, offer=offer, olympic_event=event, quantity=1, amount=12)

        url = reverse('cart-item-detail', args=[item.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(CartItem.objects.filter(pk=item.pk).exists())

    def test_unique_constraint_cart_item(self):
        """
        Test that a unique constraint prevents duplicate cart items.
        """
        cart = Cart.objects.create(custom_user=self.user)
        offer = Offer.objects.create(name='Double', price=10)
        event = OlympicEvent.objects.create(name='Double', date_time=timezone.now())
        CartItem.objects.create(cart=cart, offer=offer, olympic_event=event, quantity=1, amount=10)

        url = reverse('cart-item-list')
        payload = {
            'offer_id': offer.id,
            'olympic_event_id': event.id,
            'quantity': 2,
            'amount': 20,
        }
        # Try to create duplicate item
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('unique', str(response.data).lower())

    def test_cart_item_detail_contains_objects(self):
        """
        Test that the cart item detail contains the expected objects.
        """
        cart = Cart.objects.create(custom_user=self.user)
        offer = Offer.objects.create(name='Sérialisation', price=100)
        event = OlympicEvent.objects.create(name='Sérialisation', date_time=timezone.now())
        item = CartItem.objects.create(cart=cart, offer=offer, olympic_event=event, quantity=1, amount=100)

        url = reverse('cart-item-detail', args=[item.pk])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('offer', data)
        self.assertIsInstance(data['offer'], dict)
        self.assertEqual(data['offer']['id'], offer.id)

    def test_cart_item_amount_validation(self):
        """
        Test validation of the amount field in a cart item.
        """
        cart = Cart.objects.create(custom_user=self.user)
        offer = Offer.objects.create(name='Offre X', price=25)
        event = OlympicEvent.objects.create(name='Event X', date_time=timezone.now())

        url = reverse('cart-item-list')
        # Correct amount
        response = self.client.post(url, {
            'offer_id': offer.id,
            'olympic_event_id': event.id,
            'quantity': 2,
            'amount': 50.0,
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # Incorrect amount
        response = self.client.post(url, {
            'offer_id': offer.id,
            'olympic_event_id': event.id,
            'quantity': 2,
            'amount': 99.0,  # Incorrect
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('amount', response.data)

    def test_checkout_creates_order_and_new_cart(self):
        """
        Test that checking out a cart creates an order and a new cart.
        """
        cart = Cart.objects.create(custom_user=self.user)
        offer = Offer.objects.create(name='Checkout', price=10.0)
        event = OlympicEvent.objects.create(name='Checkout Event', date_time=timezone.now())
        CartItem.objects.create(cart=cart, offer=offer, olympic_event=event, quantity=2, amount=20.0)
        checkout_url = reverse('cart-checkout', args=[cart.pk])

        response = self.client.post(checkout_url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        cart.refresh_from_db()
        self.assertIsNotNone(cart.ordered_at)
        self.assertEqual(cart.amount, 20.0)

        open_carts = Cart.objects.filter(custom_user=self.user, ordered_at__isnull=True)
        self.assertEqual(open_carts.count(), 1)

    def test_cannot_checkout_twice(self):
        """
        Test that a cart cannot be checked out twice.
        """
        cart = Cart.objects.create(custom_user=self.user, ordered_at='2021-01-01T00:00:00Z')
        checkout_url = reverse('cart-checkout', args=[cart.pk])
        response = self.client.post(checkout_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Panier déjà validé.', response.data.get('detail', ''))
