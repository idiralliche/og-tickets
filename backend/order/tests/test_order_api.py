from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from decimal import Decimal
from order.models import Order
from offers.models import Offer
from olympic_events.models import OlympicEvent
from cart.models import Cart, CartItem

User = get_user_model()

class OrderAPITestCase(APITestCase):
    """
    Test case for the Order API endpoints.
    Tests the creation of orders and the serialization of order items.
    """
    def setUp(self):
        """
        Set up the test environment with a user, authentication, and necessary models.
        """
        self.user = User.objects.create_user(
            email='order@example.com',
            password='securepass'
        )
        self.client.force_authenticate(user=self.user)
        # Create offer & event
        self.offer = Offer.objects.create(name='Billet VIP', price=100)
        self.event = OlympicEvent.objects.create(name='Finale 100m', date_time=timezone.now())

    def create_cart_with_item(self):
        """
        Helper method to create a cart with an item for testing.
        @return: The created cart with an item.
        """
        cart = Cart.objects.create(custom_user=self.user)
        CartItem.objects.create(
            cart=cart,
            offer=self.offer,
            olympic_event=self.event,
            quantity=2,
            amount=200
        )
        return cart

    def test_order_created_on_checkout(self):
        """
        Test that an order is created on cart checkout.
        """
        cart = self.create_cart_with_item()
        url = reverse('cart-checkout', args=[cart.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertIn('id', data)
        self.assertEqual(Decimal(data['amount']), Decimal('200.00'))
        self.assertEqual(Order.objects.filter(user=self.user).count(), 1)
        order = Order.objects.get(user=self.user)
        self.assertEqual(Decimal(data['amount']), Decimal('200.00'))
        self.assertEqual(order.items.count(), 1)
        self.assertEqual(order.items.first().quantity, 2)

    def test_order_items_serialized(self):
        """
        Test that order items are correctly serialized.
        """
        cart = self.create_cart_with_item()
        url = reverse('cart-checkout', args=[cart.id])
        response = self.client.post(url)
        data = response.json()
        self.assertIn('items', data)
        self.assertTrue(len(data['items']) == 1)
        item = data['items'][0]
        self.assertEqual(item['offer']['id'], self.offer.id)
        self.assertEqual(item['quantity'], 2)
