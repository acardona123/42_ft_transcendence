from rest_framework import serializers
from .models import Tournament, Participant
from django.conf import settings
import requests
from .utils import matchmaking

class TournamentSerializer(serializers.ModelSerializer):
	nb_guest = serializers.IntegerField(required = True)
	nb_ai = serializers.IntegerField(required = True)

	class Meta:
		model = Tournament
		fields = ['game', 'max_score', 'max_duration', 'nb_guest', 'nb_ai']
		extra_kwargs = {'game': {'required': True},
						'max_score': {'required': True},
						'max_duration': {'required': True}}

	def validate_max_score(self, max_score):
		if not (1 <= max_score <= 11 or max_score == -1):
			raise serializers.ValidationError("Invalid max score")
		return max_score

	def validate_max_duration(self, max_duration):
		if not (10 <= max_duration <= 300 or max_duration == -1):
			raise serializers.ValidationError("Invalid max duration")
		return max_duration
	
	def validate(self, attrs):
		nb_player = self.context['nb_player'] + attrs['nb_guest'] + attrs['nb_ai']
		if nb_player > 16:
			raise serializers.ValidationError("Too many players in the tournament, only 16 are allowed")
		if nb_player < 3:
			raise serializers.ValidationError("Too few players in the tournament, 3 are needed")
		if attrs['game'] == Tournament.GameType.FLAPPY_BIRD and attrs['nb_ai'] != 0:
			raise serializers.ValidationError({'nb_ai': "No AI available for Flappy Bird"})
		if attrs['max_duration'] == -1 and attrs['max_score'] == -1:
			raise serializers.ValidationError("Impossible to set max score and duraion to infiny")
		return super().validate(attrs)

	def update(self, instance, validated_data):
		instance.status = Tournament.GameStatus.ADD_USER
		instance.save()
		for i in range(0, validated_data['nb_guest']):
			url=settings.USERS_MICROSERVICE_URL+'/api/private/users/new/player/guest/'
			response = requests.post(url=url)
			if response.status_code != 200:
				raise Exception("Error while creating guest user")
			instance.participant_set.create(user=response.json()['data']['id'], type=Participant.UserType.GUEST)
		for i in range(0, validated_data['nb_ai']):
			url=settings.USERS_MICROSERVICE_URL+'/api/private/users/new/player/ai/'
			response = requests.post(url=url)
			if response.status_code != 200:
				raise Exception("Error while creating ai user")
			instance.participant_set.create(user=response.json()['data']['id'], type=Participant.UserType.BOT)
		
		instance.game = validated_data['game']
		instance.max_score = validated_data['max_score']
		instance.max_duration = validated_data['max_duration']
		matchmaking(instance)
		instance.status = Tournament.GameStatus.STARTED
		instance.save()
		return instance