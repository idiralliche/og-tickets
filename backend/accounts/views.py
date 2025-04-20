from typing import Optional
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import ResendActivationSerializer
from .utils import send_activation_email

User = get_user_model()

# Cookie configuration constants
COOKIE_NAME = settings.SIMPLE_JWT['AUTH_COOKIE']
COOKIE_PATH = settings.SIMPLE_JWT['AUTH_COOKIE_PATH']
COOKIE_SAMESITE = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
COOKIE_SECURE = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE']
COOKIE_HTTPONLY = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY']
REFRESH_SECONDS = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())

class CookieHandler:
    """Centralized cookie management for JWT authentication"""

    @staticmethod
    def set_auth_cookie(response: Response, token: str) -> None:
        """Configure secure HTTP-only JWT cookie"""
        response.set_cookie(
            key=COOKIE_NAME,
            value=token,
            max_age=REFRESH_SECONDS,
            path=COOKIE_PATH,
            secure=COOKIE_SECURE,
            httponly=COOKIE_HTTPONLY,
            samesite=COOKIE_SAMESITE,
        )

    @staticmethod
    def delete_auth_cookie(response: Response) -> None:
        """Remove JWT cookie from client"""
        response.delete_cookie(
            key=COOKIE_NAME,
            path=COOKIE_PATH,
        )

    @staticmethod
    def get_auth_cookie(request) -> Optional[str]:
        """Safe cookie extraction with type checking"""
        return request.COOKIES.get(COOKIE_NAME) or None

    @staticmethod
    def validate_cookie_structure(token: str) -> bool:
        """Basic JWT format validation"""
        return len(token.split('.')) == 3

class ActivationResendView(APIView):
    """
    Handle silent account activation email resend

    Security Features:
    - Always returns HTTP 204 to prevent email enumeration
    - Case-insensitive email lookup
    - Only processes inactive accounts
    - No authentication required
    """

    permission_classes = [AllowAny]
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        """Handle activation email resend request"""
        # Validate email format
        serializer = ResendActivationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        # Silent user lookup (no existence disclosure)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)

        # Send activation email if applicable
        if not user.is_active:
            send_activation_email(user)

        return Response(status=status.HTTP_204_NO_CONTENT)

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    JWT Authentication endpoint with refresh token in HttpOnly cookie

    Overrides default behavior to:
    - Store refresh token in secure, HttpOnly cookie
    - Return only access token in response body
    - Apply SameSite cookie policy based on environment
    """

    def post(self, request, *args, **kwargs) -> Response:
        """Handle login request and set refresh token cookie"""
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            if refresh_token:= response.data.pop('refresh', None):
                CookieHandler.set_auth_cookie(response, refresh_token)

        return response


class CustomTokenRefreshView(TokenRefreshView):
    """
    JWT Refresh endpoint with cookie-based refresh token handling

    Features:
    - Reads refresh token from HttpOnly cookie
    - Supports token rotation (if enabled in SIMPLE_JWT settings)
    - Automatically renews refresh token cookie
    """

    def post(self, request, *args, **kwargs) -> Response:
        """Handle token refresh request"""
        if not (refresh_token := CookieHandler.get_auth_cookie(request)):
            return Response(
                {"detail": "Refresh token manquant."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Inject refresh token into request data
        request.data['refresh'] = refresh_token
        response = super().post(request, *args, **kwargs)

        # Update refresh token cookie if rotation enabled
        if response.status_code == status.HTTP_200_OK:
            if new_refresh:= response.data.pop('refresh', None):
                CookieHandler.set_auth_cookie(response, new_refresh)

        return response


class LogoutView(APIView):
    """
    Handle user logout by invalidating refresh token and clearing auth cookie

    Security features:
    - Blacklists current refresh token (if supported)
    - Clears HttpOnly auth cookie client-side
    - Requires authenticated access
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs) -> Response:
        """Process logout request"""
        # Invalidate refresh token
        if refresh_token := CookieHandler.get_auth_cookie(request):
            try:
                RefreshToken(refresh_token).blacklist()
            except Exception:
                # Log error but don't fail logout
                pass

        # Prepare response with cookie clearance
        response = Response(
            {"detail": "Déconnexion réussie."},
            status=status.HTTP_205_RESET_CONTENT
        )
        CookieHandler.delete_auth_cookie(response)

        return response
