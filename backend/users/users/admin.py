from django.contrib import admin

from .models import CustomUser

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class AccountAdmin(BaseUserAdmin):
    # form = UserChangeForm
    # add_form = UserCreationForm
    model=CustomUser

    list_display = ('username', 'email', 'phone', 'is_staff',  'is_superuser')
    list_filter = ('is_superuser',)

    fieldsets = (
        (None, {'fields': ('username', 'is_staff', 'is_superuser', 'password')}),
        ('Personal info', {'fields': ('email', 'phone')}),
        ('Groups', {'fields': ('groups',)}),
        ('Permissions', {'fields': ('user_permissions',)}),
    )
    add_fieldsets = (
        (None, {'fields': ('username', 'is_staff', 'is_superuser', 'password1', 'password2')}),
        ('Personal info', {'fields': ('email', 'phone')}),
        ('Groups', {'fields': ('groups',)}),
        ('Permissions', {'fields': ('user_permissions',)}),
    )

    search_fields = ('username', 'email', 'phone')
    ordering = ('username',)
    filter_horizontal = ()


admin.site.register(CustomUser, AccountAdmin)
