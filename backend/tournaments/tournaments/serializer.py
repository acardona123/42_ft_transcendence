from rest_framework import serializers
from .models import Tournament
from django.conf import USERS_MICROSERVICE_URL
import requests

class TournamentSerializer(serializers.ModelSerializer):
	nb_guest = serializers.IntegerField(required = True)
	nb_ai = serializers.IntegerField(required = True)

	class Meta:
		model = Tournament
		fields = ['game', 'max_score', 'max_duration', 'nb_guest', 'nb_ai']
		extra_kwargs = {'game': {'required': True},
						'max_score': {'required': True},
						'max_duration': {'required': True}}
	
	def validate(self, attrs):
		if self.context['nb_player'] + attrs['nd_guest'] + attrs['nb_ai'] > 16:
			raise serializers.ValidationError("Too many players in the tournament, only 16 are allowed")
		return super().validate(attrs)

	def to_update(self, instance, validated_data):
		for i in range(0, validated_data['nb_guest']):
			url=USERS_MICROSERVICE_URL+'/api/private/users/new/player/guest'
			response = requests.post(url=url)
			if response.status_code != 200:
				raise Exception("Error while creating guest user")
			instance.participant_set.create(user=response.json()['data']['id'])

		for i in range(0, validated_data['nb_ai']):
			url=USERS_MICROSERVICE_URL+'/api/private/users/new/player/ai'
			response = requests.post(url=url)
			if response.status_code != 200:
				raise Exception("Error while creating ai user")
			instance.participant_set.create(user=response.json()['data']['id'])
		
		instance.game = validated_data['game']
		instance.max_score = validated_data['max_score']
		instance.max_duration = validated_data['max_duration']
		instance.save()
		return instance