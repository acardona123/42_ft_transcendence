from django.contrib import admin

from .models import FriendRequest, Friendship

class FriendshipAdmin(admin.ModelAdmin):
	list_display = ('id', 'user1', 'user2')

class FriendRequestAdmin(admin.ModelAdmin):
	list_display = ('id', 'sender', 'receiver')

admin.site.register(Friendship, FriendshipAdmin)
admin.site.register(FriendRequest, FriendRequestAdmin)

