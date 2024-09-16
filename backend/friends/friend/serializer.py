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
	username = serializers.IntegerField(source='sender')
	class Meta:
		model = FriendRequest
		fields = ('id', 'username', 'receiver', 'date') #'__all__'
	
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		
		self.has_username = "username" in self.fields

		if hasattr(self, 'instance') and "username" in self.fields and isinstance(self.instance, list):
			sender_ids = [friend_request.sender for friend_request in self.instance]
			self.usernames_map = self.get_usernames(sender_ids)
		else:
			self.usernames_map = {str(self.instance.sender) : self.context.get('username')}
	
	def get_usernames(self, users_id):
		url = f"{settings.USERS_MICROSERVICE_URL}/api/users/usernames/"
		# print(url)
		response = requests.post(url, json={'users' : users_id})
		if response.status_code != 200:
			raise BadRequest
		# print(response.json())
		return response.json()
	
	def to_representation(self, instance):
		representation = super().to_representation(instance)
		if not self.has_username:
			return representation
		sender_id = representation['username']
		representation['username'] = self.usernames_map.get(str(sender_id))
		# print(representation)
		return representation
	
class FriendshipSerializer(serializers.ModelSerializer):
	username = serializers.SerializerMethodField()

	class Meta:
		model = Friendship
		fields = 'id', 'username'
	
	def get_username(self, obj):
		if obj.user1 == self.context.get('user_id'):
			return self.usernames_map.get(str(obj.user2))
		else:
			return self.usernames_map.get(str(obj.user1))


	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)

		self.has_username = "username" in self.fields
		
		if hasattr(self, 'instance') and "username" in self.fields and isinstance(self.instance, list):
			friends_id = list()
			for friend_request in self.instance:
				if friend_request.user1 == self.context.get('user_id'):
					friends_id.append(friend_request.user2)
				else:
					friends_id.append(friend_request.user1)
			self.usernames_map = self.get_usernames_request(friends_id)
		else:
			print('coucou')
			if self.instance.user1 == self.context.get('user_id'):
				self.usernames_map = {str(self.instance.user2) : self.context.get('username')}
			else:
				self.usernames_map = {str(self.instance.user1) : self.context.get('username')}

	
	def get_usernames_request(self, users_id):
		url = f"{settings.USERS_MICROSERVICE_URL}/api/users/usernames/"
		# print(url)
		response = requests.post(url, json={'users' : users_id})
		if response.status_code != 200:
			raise BadRequest
		# print(response.json())
		return response.json()
