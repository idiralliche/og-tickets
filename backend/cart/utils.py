from rest_framework import serializers

def check_cart_not_ordered(cart):
    """
    Validates that a cart has not been ordered yet.
    Raises a validation error if the cart has already been ordered.

    @param cart: The cart object to validate.
    @type cart: Cart
    @raises serializers.ValidationError: If the cart has already been ordered.
    """
    if cart.ordered_at:
        raise serializers.ValidationError(
            {'detail': "Impossible de modifier un panier déjà validé."}
        )

