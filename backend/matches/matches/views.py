
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
from django.core.exceptions import BadRequest
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
# # ========== End Tests ==========


def get_authenticated_user_id(request):
	user_id = 7 #request.auth.get('id')
	return user_id


# === Historic display ===

@api_view(['GET'])
def match_history(request):
	user_id = get_authenticated_user_id()

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



#  === New game ===


def new_match(request, player_id1, player_id2):

	request_game = request.POST.get('game')
	request_max_score = request.POST.get('max_score')
	request_max_duration = request.POST.get('max_duration')
	request_clean_when_finished = request.POST.get('clean_when_finished')
	if not request_game or (request_game != 'FB' and request_game != 'PG'):
		return Response({'error' : 'Wrong/missing game identifier'},
			status=status.HTTP_400_BAD_REQUEST)
	if not request_max_score: 
		return Response({'error' : 'Match max score not provide'},
			status=status.HTTP_400_BAD_REQUEST)
	if not request_max_duration:
		return Response({'error' : 'Match max duration not provide'},
			status=status.HTTP_400_BAD_REQUEST)
	if not request_clean_when_finished: #TODO: check is a False value does not trigger this...
		return Response({'error' : 'Match clean when finished indication not provide'},
			status=status.HTTP_400_BAD_REQUEST)

	match = Match(
			user1 = player_id1,
			user2 = player_id2,
			game = request_game,
			max_score = request_max_score,
			max_duration = request_max_duration,
			clean_when_finished = request_clean_when_finished
		)
	match.save()


@api_view(['POST'])
def new_match_against_ai(request):
	user_id = get_authenticated_user_id()
	ai = get_new_ai_request()
	ai_id = ai.get("id")
	new_match(request, user_id, ai_id)

def get_new_ai_request():
	url = f"{settings.USERS_MICROSERVICE_URL}/api/users/new/ai"
	response = requests.get(url)
	if response.status_code != 200:
		raise BadRequest
	return response.json()


@api_view(['POST'])
def new_match_against_guest(request):
	user_id = get_authenticated_user_id()
	guest = get_new_guest_request()
	guest_id = guest.get("id")
	new_match(request, user_id, guest_id)

def get_new_guest_request():
	url = f"{settings.USERS_MICROSERVICE_URL}/api/users/new/guest"
	response = requests.get(url)
	if response.status_code != 200:
		raise BadRequest
	return response.json()


@api_view(['POST'])
def new_match_against_player(request):
	user_id = get_authenticated_user_id(request)
	# check le pin ici ??? sinon il faut que ca ne puisse etre fait que par le back apres verification...