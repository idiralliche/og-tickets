from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    """Serializer for returning user details"""
    class Meta:
        model = CustomUser
        # Exclude some fields from the response when reading
        fields = ('id', 'first_name', 'last_name', 'email', 'role', 'is_active', 'created_at', 'updated_at', 'deleted_at')
        read_only_fields = ('id', 'role', 'is_active', 'created_at', 'updated_at', 'deleted_at')


class CustomUserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new user.
    The password is write_only so it is not returned in the response.
    """
    password = serializers.CharField(write_only=True)
    re_password = serializers.CharField(write_only=True)  # pour la confirmation du mot de passe

    class Meta:
        model = CustomUser
        fields = ('id', 'first_name', 'last_name', 'email', 'password', 're_password')
        extra_kwargs = {
            'id': {'read_only': True},
        }

    def validate(self, data):
        """
        Validate that the two passwords match.
        """
        if data.get('password') != data.get('re_password'):
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data

    def create(self, validated_data):
        # Remove the re_password field, it is not needed for creation
        validated_data.pop('re_password')
        # Create the user with the default role 'customer'
        user = CustomUser.objects.create_user(**validated_data)
        return user
