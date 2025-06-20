from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """
    Custom User model administration interface

    Extends default UserAdmin with:
    - Email-based authentication
    - Custom field ordering and display
    - Localization for admin labels
    """
    model = CustomUser
    ordering = ('email',)
    list_display = (
        'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser', 'user_key'
    )

    # Main edit form fieldsets
    fieldsets = (
        (None, {'fields': ('email', 'password', 'user_key')}),
        ('Informations personnelles', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Dates importantes', {'fields': ('last_login',)}),
        ('Champs personnalisés', {'fields': ('deleted_at', 'role')}),
    )

    # Add user form fieldsets
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'user_key'),
        }),
    )

    # Admin list configuration
    search_fields = ('email', 'first_name', 'last_name', 'user_key')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
