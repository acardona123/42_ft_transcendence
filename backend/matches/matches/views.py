
from django.http import JsonResponse

from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta
from django.utils import timezone

from matches.models import Match
from matches.serializer import MatchSerializer

from django.db.models import Q
from django.conf import settings
import requests



# # ========== Tests ==========

from django.http import HttpResponse


# @api_view(['GET'])
def test_hello(request):
	return HttpResponse("Hello world!")


import random

def test_create_matches(request):
	num_matches = 10
	matches = []
	for i in range(num_matches):
		user1 = random.randint(1, 10)
		user2 = random.randint(1, 10)
		
		while user2 == user1:
			user2 = random.randint(1, 10)
		
		match = Match(
			user1=user1,
			user2=user2,
			game=random.choice(['FB', 'PG']),
			max_score=21,
			max_duration=300,
			score1=random.randint(0, 21),
			score2=random.randint(0, 21),
			duration=random.randint(100, 300),
			is_finished=True,
			clean_when_finished=True,
			date=timezone.now() - timedelta(days=random.randint(0, 30))
		)
		matches.append(match)
	
	# Bulk create all matches in the database
	Match.objects.bulk_create(matches)
	return HttpResponse("10 Matches created!")


@api_view(['GET'])

def match_history(request):
	user_id = 7 #request.auth.get('id')

	# if player_is_not_authenticated():
	# 	return Response({'error': 'can\'t access the historic without being identified as a player'},
	# 		status=status.HTTP_403_FORBIDDEN)


	matches = Match.objects.filter((Q(user1=user_id) | Q(user2=user_id)) & Q(is_finished=True))

	try:
		serializer= MatchSerializer(matches, many=True, context={'user_id': user_id}, fields=['game', 'date', 'duration', 'main_player_username', 'opponent_username', 'main_player_score', 'opponent_score'])
		print(serializer.data)
		return JsonResponse(serializer.data, safe=False)
	except:
		return Response({'error': 'retrieving match historic'},
			status=status.HTTP_500_INTERNAL_SERVER_ERROR)

