from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.utils import timezone
from datetime import datetime
from .models import OlympicEvent

class OlympicEventAPITests(APITestCase):
    def setUp(self):
        # Create sample events
        self.event1 = OlympicEvent.objects.create(
            sport="Basketball",
            name="Hommes, phase de groupe",
            description="groupe C, Jeu 19",
            date_time=timezone.make_aware(datetime.fromisoformat("2024-07-31T17:15:00")),
            location="Stade Pierre Mauroy"
        )
        self.event2 = OlympicEvent.objects.create(
            sport="Judo",
            name="-48 kg - fem., éliminatoire",
            description="1/16 finale, Concours 1",
            date_time=timezone.make_aware(datetime.fromisoformat("2024-07-27T10:00:00")),
            location="Champ de Mars Arena"
        )

    def test_get_olympic_events(self):
        """
        Ensure the API returns the list of events in flat JSON format.
        """
        url = reverse('olympic_events_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        # Check that the response is a non-empty list
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 2)

        # Check that each event has the expected keys
        for event in data:
            self.assertIn('id', event)
            self.assertIn('sport', event)
            self.assertIn('name', event)
            self.assertIn('description', event)
            self.assertIn('date_time', event)
            self.assertIn('location', event)

    def test_olympic_event_str(self):
        """
        Ensure the model's __str__ method returns the event name.
        """
        self.assertEqual(str(self.event1), self.event1.name)
