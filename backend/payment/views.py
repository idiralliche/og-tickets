import stripe
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

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
