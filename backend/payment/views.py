import stripe
from django.conf import settings
from django.db import transaction
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from order.models import Order

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    """
    Creates a Stripe PaymentIntent to initiate a payment.
    Expects in the request body:
      - amount (in euros)

    @param request: The request object containing the amount to charge.
    @return: Response with the client secret for the PaymentIntent or an error message.
    """
    amount = request.data.get('amount')
    if not amount:
        return Response({"error": "Amount is required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        # Stripe expects the amount in cents
        stripe.api_key = settings.STRIPE_SECRET_KEY
        intent = stripe.PaymentIntent.create(
            amount=int(float(amount) * 100),  # euros → cents
            currency='eur',
            metadata={'user_id': request.user.id},
        )
        return Response({
            "clientSecret": intent.client_secret
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        return Response(status=400)
    except stripe.error.SignatureVerificationError:
        return Response(status=400)

    # Successful payment event handling
    if event['type'] == 'payment_intent.succeeded':
        intent = event['data']['object']
        user_id = intent['metadata'].get('user_id')
        order = Order.objects.filter(user_id=user_id, status='pending').order_by('-created_at').first()
        if order:
            with transaction.atomic():
                order.mark_as_paid()

    return Response(status=200)
