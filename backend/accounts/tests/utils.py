from django.core import mail
from django.contrib.auth import get_user_model
from django.test.client import Client


def create_test_user (
        email:str,
        password:str,
        first_name:str = 'Foo',
        last_name:str = 'Bar',
        is_active:bool = False,
):
    """Create a user with the given arguments"""
    user = get_user_model().objects.create_user(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        is_active=is_active
    )
    user.save()

    return user
