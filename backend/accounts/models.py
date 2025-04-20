from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    """Custom user manager for email-based authentication"""

    def create_user(self, email: str, password: str = None, **extra_fields) -> 'CustomUser':
        """
        Create and save a regular user with the given email and password
        Raises ValueError if email is not provided
        """
        if not email:
            raise ValueError("L’adresse email doit être renseignée")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email: str, password: str = None, **extra_fields) -> 'CustomUser':
        """
        Create a superuser with admin privileges
        Sets default admin role and activates account
        """
        extra_fields.setdefault('role', 'admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Configuration invalide pour le superuser.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Configuration invalide pour le superuser.")

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    """Custom user model implementing soft delete and role-based access"""

    # Identification fields
    id = models.BigAutoField(primary_key=True)
    email = models.EmailField(unique=True)

    # Personal info
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)

    # Role management
    role = models.CharField(
        max_length=50,
        choices=(
            ('admin', 'Admin'),
            ('customer', 'Customer'),
        ),
        default='customer'
    )

    # Status flags
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False) # Admin backoffice access

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Soft delete
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table = 'ogtickets_user'

    def delete(self, using=None, keep_parents=False):
        """Soft delete : Mark user as deleted instead of permanent removal."""
        self.deleted_at = timezone.now()
        self.save()

    def hard_delete(self, using=None, keep_parents=False):
        """Permanently remove user from database."""
        super().delete(using=using, keep_parents=keep_parents)

    def __str__(self):
        return self.email
