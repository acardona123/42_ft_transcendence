from rest_framework import serializers
from .models import FriendRequest, Friendship
from django.core.exceptions import BadRequest

from django.conf import settings
import requests

class DynamicFieldsModelSerializer(serializers.ModelSerializer):
	def __init__(self, *args, **kwargs):
		fields = kwargs.pop('fields', None)

		super().__init__(*args, **kwargs)

		if fields is not None:
			allowed = set(fields)
			existing = set(self.fields)
			for field_name in existing - allowed:
				self.fields.pop(field_name)

class FriendRequestSerializer(DynamicFieldsModelSerializer):
	class Meta:
		model = FriendRequest
		fields = ('id', 'sender', 'receiver') #'__all__'
	
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		
		if hasattr(self, 'instance') and "sender" in self.fields:
			
			sender_ids = [friend_request.sender for friend_request in self.instance]
			self.usernames_map = self.get_usernames(sender_ids)
		else:
			self.usernames_map = {}
	
	def get_usernames(self, users_id):
		url = f"{settings.USERS_MICROSERVICE_URL}/api/users/usernames/"
		print(url)
		response = requests.post(url, json={'users' : users_id})
		if response.status_code != 200:
			raise BadRequest
		print(response.json())
		return response.json()
	
	def to_representation(self, instance):
		representation = super().to_representation(instance)
		sender_id = representation['sender']
		representation['sender'] = self.usernames_map.get(str(sender_id))
		print(representation)
		return representation
