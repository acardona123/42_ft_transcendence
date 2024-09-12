from rest_framework import serializers
from .models import FriendRequest, Friendship

class FriendRequestSerializer(serializers.ModelSerializer):
	class Meta:
		model = FriendRequest
		fields = ('id', 'sender', 'receiver') #'__all__'