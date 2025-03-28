from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("L’adresse email doit être renseignée")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
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
    id = models.BigAutoField(primary_key=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(unique=True)

    role = models.CharField(max_length=50, choices=(
        ('admin', 'Admin'),
        ('customer', 'Customer'),
    ), default='customer')

    # AccountStatus
    is_active = models.BooleanField(default=False)
    # Admin backoffice access
    is_staff = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Soft delete
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    def delete(self, using=None, keep_parents=False):
        """Soft delete : update deleted_at instead of permanently deleting."""
        self.deleted_at = timezone.now()
        self.save()

    def hard_delete(self, using=None, keep_parents=False):
        """Permanently delete user."""
        super().delete(using=using, keep_parents=keep_parents)

    def __str__(self):
        return self.email

    class Meta:
        db_table = 'ogtickets_user'
