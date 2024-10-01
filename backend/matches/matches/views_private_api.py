import json
from django.http import JsonResponse

from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes

from matches.models import Match
from matches.serializer import MatchSerializer

from django.conf import settings
from django.core.exceptions import BadRequest
import requests


def create_new_match(response_data):
	# match creation
	try:
		match = Match.objects.create(
			user1 = response_data['user1'],
			user2 = response_data['user2'],
			game = response_data['game'],
			max_score = response_data['max_score'],
			max_duration = response_data['max_duration'],
			clean_when_finished = response_data['clean_when_finished']
		)
	except Exception as e:
		return JsonResponse(status = 400, data = {'message' : f"Match creation: {e}"})

	# writing the new match data in the response
	try:
		serializer = MatchSerializer(match, fields=['index', 'user1', 'user2', 'game', 'max_score', 'max_duration', 'clean_when_finished'])
		response_data = {'message':'match created', 'match_data':serializer.data}
		return JsonResponse(status = 200, data = response_data, safe=False)
	except:
		return JsonResponse(status = 200, data = {'message': 'match created but failed to be displayed.', 'id': match.id})


@api_view(['POST'])
def new_match_verified_id(request):
	#extracting from the request the data required for the match creation
	try:
		json_data = json.loads(request.body)
	except:
		return JsonResponse(status = 400, data = {'message': 'Expecting a json body for creating a new match'})
	match_data = {}
	match_data['user1'] = json_data.get('player1')
	match_data['user2'] = json_data.get('player2')
	match_data['game'] = json_data.get('game')
	match_data['max_score'] = json_data.get('max_score')
	match_data['max_duration'] = json_data.get('max_duration')
	match_data['tournament_id'] = json_data.get('tournament_id')
	if not 'user1' in match_data: 
		return JsonResponse(status = 400, data = {'message' : 'First player\'s id not provided'})
	if not 'user2' in match_data: 
		return JsonResponse(status = 400, data = {'message' : 'Second player\'s id id not provided'})
	if not 'game' in match_data or (match_data['game'] != 'FB' and match_data['game'] != 'PG'):
		return JsonResponse(status = 400, data = {'message' : 'Wrong/missing game identifier'})
	if not 'max_score' in match_data: 
		return JsonResponse(status = 400, data = {'message' : 'Match max score not provided'})
	if not 'max_duration' in match_data:
		return JsonResponse(status = 400, data = {'message' : 'Match max duration not provided'})
	if not 'clean_when_finished' in match_data and match_data['clean_when_finished'] != False :
		return JsonResponse(status = 400, data = {'message' : 'Match clean when finished indication not provided'})

	# match creation
	return create_new_match(match_data)

