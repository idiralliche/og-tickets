from typing import Optional, Any
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from djoser.views import UserViewSet as DjoserUserViewSet
from .tasks import send_password_reset_email_task, send_password_reset_email_task
from .models import CustomUser

# Cookie configuration constants from settings
COOKIE_NAME: str = settings.SIMPLE_JWT['AUTH_COOKIE']
COOKIE_PATH: str = settings.SIMPLE_JWT['AUTH_COOKIE_PATH']
COOKIE_SAMESITE: str = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
COOKIE_SECURE: bool = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE']
COOKIE_HTTPONLY: bool = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY']
REFRESH_SECONDS: int = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())

class CookieHandler:
    """Centralized handler for JWT authentication cookie operations.
    
    Provides static methods for consistent cookie management across all authentication views.
    """

    @staticmethod
    def set_auth_cookie(response: Response, token: str) -> None:
        """Configure secure HTTP-only JWT cookie in the response.
        
        Args:
            response: DRF Response object to set the cookie in
            token: JWT refresh token value to store
            
        Note:
            Uses settings-configured parameters for security consistency
        """
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
        """Remove JWT authentication cookie from client.
        
        Args:
            response: DRF Response object to clear the cookie in
        """
        response.delete_cookie(
            key=COOKIE_NAME,
            path=COOKIE_PATH,
        )

    @staticmethod
    def get_auth_cookie(request: Request) -> Optional[str]:
        """Safely extract JWT cookie value from request.
        
        Args:
            request: DRF Request object to check cookies in
            
        Returns:
            Optional[str]: Cookie value if present and valid, None otherwise
        """
        return request.COOKIES.get(COOKIE_NAME) or None

    @staticmethod
    def validate_cookie_structure(token: str) -> bool:
        """Basic structural validation for JWT tokens.
        
        Args:
            token: JWT string to validate
            
        Returns:
            bool: True if token has 3 dot-separated parts (standard JWT structure)
        """
        return len(token.split('.')) == 3

@method_decorator(csrf_protect, name='dispatch')
class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom JWT authentication endpoint with secure cookie handling.
    
    Extends standard TokenObtainPairView to:
    - Store refresh token in HttpOnly cookie
    - Return only access token in response body
    - Apply CSRF protection
    """

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """Handle login request and configure authentication cookies.
        
        Args:
            request: Incoming authentication request
            *args: Additional positional arguments
            **kwargs: Additional keyword arguments
            
        Returns:
            Response: DRF Response with access token and refresh token cookie
        """
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            if refresh_token:= response.data.pop('refresh', None):
                CookieHandler.set_auth_cookie(response, refresh_token)

        return response

@method_decorator(csrf_protect, name='dispatch')
class CustomTokenRefreshView(TokenRefreshView):
    """Custom JWT refresh endpoint with cookie-based token handling.
    
    Extends standard TokenRefreshView to:
    - Read refresh token from HttpOnly cookie
    - Support token rotation
    - Renew refresh token cookie automatically
    """

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """Handle token refresh request using cookie-stored refresh token.
        
        Args:
            request: Incoming refresh request
            *args: Additional positional arguments
            **kwargs: Additional keyword arguments
            
        Returns:
            Response: DRF Response with new access token
            
        Raises:
            HTTP 400 if refresh cookie is missing
        """
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
            if new_refresh := response.data.pop('refresh', None):
                CookieHandler.set_auth_cookie(response, new_refresh)

        return response


class LogoutView(APIView):
    """Secure logout endpoint with token invalidation.
    
    Features:
    - Blacklists current refresh token
    - Clears authentication cookie
    - Requires authentication
    """
    permission_classes = [IsAuthenticated]

    def post(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """Process logout request and invalidate tokens.
        
        Args:
            request: Incoming logout request
            *args: Additional positional arguments
            **kwargs: Additional keyword arguments
            
        Returns:
            Response: Confirmation response with cleared cookie
        """
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

@method_decorator(csrf_protect, name='dispatch')
class CustomUserViewSet(DjoserUserViewSet):
    """Extended user management ViewSet with custom password reset.
    
    Maintains all Djoser functionality while adding:
    - CSRF protection
    - Celery-powered password reset
    - Relaxed permissions for password reset
    """
    permission_classes = [AllowAny]

    def reset_password(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        """Handle password reset request with Celery task.
        
        Args:
            request: Incoming password reset request
            *args: Additional positional arguments
            **kwargs: Additional keyword arguments
            
        Returns:
            Response: Always HTTP 204 regardless of email existence
            
        Security:
            - Prevents email enumeration
            - Uses Celery for async email delivery
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = CustomUser.objects.get(email=email)
            send_password_reset_email_task.delay(user.id)
        except CustomUser.DoesNotExist:
            pass

        return Response(status=status.HTTP_204_NO_CONTENT)
