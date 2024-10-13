from django.contrib import admin

from .models import CustomUser, ProfilePicture

from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class AccountAdmin(BaseUserAdmin):
    model=CustomUser

    list_display = ('username', 'type', 'email', 'phone', 'pin', 'is_staff', 'last_activity',
                    'oauth_id', 'is_2fa_enable', 'is_superuser', 'is_online')
    list_filter = ('is_superuser',)

    fieldsets = (
        (None, {'fields': ('username', 'type', 'is_staff', 'is_superuser', 'is_2fa_enable', 'is_online', 'last_activity', 'password')}),
        ('Personal info', {'fields': ('email', 'phone', 'oauth_id','pin')}),
        ('Groups', {'fields': ('groups',)}),
        ('Permissions', {'fields': ('user_permissions',)}),
    )
    add_fieldsets = (
        (None, {'fields': ('username', 'type', 'is_staff', 'is_superuser', 'is_2fa_enable', 'is_online', 'last_activity', 'password')}),
        ('Personal info', {'fields': ('email', 'phone', 'oauth_id','pin')}),
        ('Groups', {'fields': ('groups',)}),
        ('Permissions', {'fields': ('user_permissions',)}),
    )

    search_fields = ('username', 'email', 'phone')
    ordering = ('username',)
    filter_horizontal = ()

class ProfileAdmin(admin.ModelAdmin):
    list_display = ["user", 'profile_picture', 'oauth_profile_picture']

admin.site.register(CustomUser, AccountAdmin)
admin.site.register(ProfilePicture, ProfileAdmin)