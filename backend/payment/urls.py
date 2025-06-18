from django.urls import path
from .views import create_payment_intent, stripe_webhook

urlpatterns = [
    path('create/', create_payment_intent, name='create-payment-intent'),
    path('webhook/', stripe_webhook, name='stripe-webhook'),
]
