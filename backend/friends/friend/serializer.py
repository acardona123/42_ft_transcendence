from rest_framework import serializers
from .models import FriendRequest, Friendship
from django.core.exceptions import BadRequest
from django.db.models.query import QuerySet

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
		fields = ('id', 'username', 'receiver', 'date')
	
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		
		self.has_username = ("username" in self.fields)
		if hasattr(self, 'instance') and "username" in self.fields and isinstance(self.instance, QuerySet):
			sender_ids = [friend_request.sender for friend_request in self.instance]
			self.usernames_map = self.get_usernames(sender_ids)
		else:
			self.usernames_map = {str(self.instance.sender) : self.context.get('username', None)}
	
	def get_usernames(self, users_id):
		url = f"{settings.USERS_MICROSERVICE_URL}/api/private/users/retrieve/usernames/"
		response = requests.post(url, json={'users_id': users_id})
		if response.status_code != 200:
			raise Exception
		return response.json().get('data', None)
	
	def to_representation(self, instance):
		representation = super().to_representation(instance)
		if not self.has_username:
			return representation
		sender_id = representation['username']
		representation['username'] = self.usernames_map.get(str(sender_id), None)
		return representation
	
class FriendshipSerializer(serializers.ModelSerializer):
	username = serializers.SerializerMethodField()
	profile_picture = serializers.SerializerMethodField()
	status = serializers.SerializerMethodField()

	class Meta:
		model = Friendship
		fields = 'id', 'username', 'profile_picture', 'status'
	
	def get_username(self, obj):
		if obj.user1 == self.context.get('user_id'):
			id = self.usernames_map.get(str(obj.user2))
			if id != None:
				id = id.get('username', None)
			return id
		else:
			id = self.usernames_map.get(str(obj.user1))
			if id != None:
				id = id.get('username', None)
			return id

	def get_profile_picture(self, obj):
		if obj.user1 == self.context.get('user_id'):
			image = self.usernames_map.get(str(obj.user2))
			if image != None:
				image = image.get('picture', None)
			return image
		else:
			image = self.usernames_map.get(str(obj.user1))
			if image != None:
				image = image.get('picture', None)
			return image

	def get_status(self, obj):
		if obj.user1 == self.context.get('user_id'):
			status = self.usernames_map.get(str(obj.user2))
			if status != None:
				status = status.get('status', None)
			return status
		else:
			status = self.usernames_map.get(str(obj.user1))
			if status != None:
				status = status.get('status', None)
			return status

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)

		if hasattr(self, 'instance') and isinstance(self.instance, QuerySet):
			friends_id = list()
			for friend_request in self.instance:
				if friend_request.user1 == self.context.get('user_id'):
					friends_id.append(friend_request.user2)
				else:
					friends_id.append(friend_request.user1)
			self.usernames_map = self.get_usernames_request(friends_id)
		else:
			if self.context.get('username') == None:
				if self.instance.user1 == self.context.get('user_id'):
					self.usernames_map = self.get_usernames_request([self.instance.user2])
				else:
					self.usernames_map = self.get_usernames_request([self.instance.user1])
			else:
				self.usernames_map = None

	
	def get_usernames_request(self, users_id):
		url = f"{settings.USERS_MICROSERVICE_URL}/api/private/users/retrieve/friends_info/"
		response = requests.post(url, json={'users_idf': users_id})
		if response.status_code != 200:
			raise Exception
		return response.json().get('data', None)
