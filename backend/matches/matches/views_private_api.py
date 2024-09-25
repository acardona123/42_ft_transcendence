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


def create_new_match(data):
	# match creation
	try:
		match = Match.objects.create(
			user1 = data['user1'],
			user2 = data['user2'],
			game = data['game'],
			max_score = data['max_score'],
			max_duration = data['max_duration'],
			clean_when_finished = data['clean_when_finished']
		)
	except Exception as e:
		return JsonResponse({'status': 400, 'message' : f"Match creation: {e}"})

	# writing the new match data in the response
	try:
		serializer = MatchSerializer(match, fields=['index', 'user1', 'user2', 'game', 'max_score', 'max_duration', 'clean_when_finished'])
		data = {'status':200, 'message':'match created', 'match_data':serializer.data}
		return JsonResponse(data, safe=False)
	except:
		return JsonResponse({'status': 200, 'message': 'match created but failed to be displayed.', 'id': match.id})


@api_view(['POST'])
def new_match_verified_id(request):
	#extracting from the request the data required for the match creation
	try:
		json_data = json.loads(request.body)
	except:
		return JsonResponse({'status': 400,'message': 'Expecting a json body for creating a new match'})
	match_data = {}
	match_data['user1'] = json_data.get('player1')
	match_data['user2'] = json_data.get('player2')
	match_data['game'] = json_data.get('game')
	match_data['max_score'] = json_data.get('max_score')
	match_data['max_duration'] = json_data.get('max_duration')
	match_data['clean_when_finished'] = json_data.get('clean_when_finished')
	if not match_data['user1']: 
		return JsonResponse({'status': 400,'message' : 'First player\'s id not provided'})
	if not match_data['user2']: 
		return JsonResponse({'status': 400,'message' : 'Second player\'s id id not provided'})
	if not match_data['game'] or (match_data['game'] != 'FB' and match_data['game'] != 'PG'):
		return JsonResponse({'status': 400,'message' : 'Wrong/missing game identifier'})
	if not match_data['max_score']: 
		return JsonResponse({'status': 400,'message' : 'Match max score not provided'})
	if not match_data['max_duration']:
		return JsonResponse({'status': 400,'message' : 'Match max duration not provided'})
	if not match_data['clean_when_finished'] and match_data['clean_when_finished'] != False :
		return JsonResponse({'status': 400,'message' : 'Match clean when finished indication not provided'})

	# match creation
	return create_new_match(match_data)

