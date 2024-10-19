from rest_framework import serializers
from .models import Match
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



class MatchSerializer(DynamicFieldsModelSerializer):

	class Meta:
		model = Match
		fields = ['id', 'user1', 'user2', 'game', 'max_score', 'max_duration', 'date', 'score1', 'score2', 'duration', 'is_finished', 'tournament_id']
	
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)


class MatchDisplaySerializer(DynamicFieldsModelSerializer):
	main_player_id = serializers.SerializerMethodField()
	opponent_id = serializers.SerializerMethodField()
	main_player_username = serializers.SerializerMethodField()
	opponent_username = serializers.SerializerMethodField()
	main_player_score = serializers.SerializerMethodField()
	opponent_score = serializers.SerializerMethodField()

	class Meta:
		model = Match
		fields = ['id', 'game', 'max_score', 'max_duration', 'date', 'duration', 'main_player_id', 'opponent_id', 'main_player_username', 'opponent_username', 'main_player_score', 'opponent_score', 'tournament_id']


	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)

		self.user_id = self.context.get('user_id')
		if self.user_id == None:
			raise ("user_id is needed in context to use the match history serializer")
		if hasattr(self, 'instance') and 'opponent_username' in self.fields:
			opponents_ids = list()
			for match in self.instance:
				if match.user1 == self.user_id:
					opponents_ids.append(match.user2)
				else:
					opponents_ids.append(match.user1)
			self.opponents_id_map = self.get_usernames_request(opponents_ids)
		else:
			self.opponents_id_map = {}


	def get_main_player_id(self, obj):
		return self.user_id

	def get_opponent_id(self, obj):
		if self.user_id == obj.user1:
			return obj.user2
		else:
			return obj.user1

	def get_main_player_score(self, obj):
		if self.user_id == obj.user1:
			return obj.score1
		else:
			return obj.score2

	def get_opponent_score(self, obj):
		if self.user_id == obj.user1:
			return obj.score2
		else:
			return obj.score1

	def get_main_player_username(self, obj):
		if "main_player_username" in self.fields:
			return self.get_usernames_request([self.user_id]).get(str(self.user_id))
		else:
			return ""
	
	def get_opponent_username(self, obj):
		if "opponent_username" in self.fields:
			if self.user_id == obj.user1:
				return self.opponents_id_map.get(str(obj.user2))
			else:
				return self.opponents_id_map.get(str(obj.user1))
		else :
			return ""

	# def get_usernames_request(self, users_id):
	# 	url = f"{settings.USERS_MICROSERVICE_URL}/api/users/usernames/"
	# 	response = requests.post(url, json={'users' : users_id})
	# 	if response.status_code != 200:
	# 		raise BadRequest
	# 	return response.json()


	def get_usernames_request(self, users_id):
		usernames = {};
		for user in users_id:
			id = str(user)
			name = "username_id_" + id
			usernames[id] = name
		return usernames

