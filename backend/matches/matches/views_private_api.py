import json
from django.http import JsonResponse

from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes

from matches.models import Match
from matches.serializer import MatchDisplaySerializer

from django.conf import settings
from django.db.models import Q
from django.core.exceptions import BadRequest
import requests

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


MSG_MATCH_CREATION_SUCCESS = 'match created'
DOC_CREATION_MATCHES = openapi.Response(
			description=MSG_MATCH_CREATION_SUCCESS,
			examples={
				"application/json": {
					"message": "match created",
					"data": [
					{
						"id": 1,
						"game": "PG",
						"max_score": 5,
						"max_duration": -1,
						"main_player_username": "username_id_0",
						"opponent_username": "username_id_10",
						"tournament_id": -1
					}
					]
				}
			}
		)
MSG_ERROR_MATCH_CREATION_MISSING_PLAYER1 = 'First player\'s id not provided'
MSG_ERROR_MATCH_CREATION_MISSING_PLAYER2 = 'Second player\'s id not provided'
MSG_ERROR_MATCH_CREATION_WRONG_GAME = 'Wrong/missing game identifier'
MSG_ERROR_MATCH_CREATION_MISSING_SCORE = 'Match max score not provided'
MSG_ERROR_MATCH_CREATION_MISSING_DURATION = 'Match max duration not provided'
MSG_ERROR_JSON_FORMAT = 'Expecting a json body for creating a new match'
MSG_ERROR_PLAYER_ID = 'Impossible to play against the same player'

def doc_error_generation(err_description, err_msg):
	return (openapi.Response(
				description="Error: " + err_description,
				examples={
					"application/json": {
						"message": err_msg
					}
				})
			)


def create_new_match(response_data):
	# match creation
	try:
		match = Match.objects.create(
			user1 = response_data['user1'],
			user2 = response_data['user2'],
			game = response_data['game'],
			max_score = response_data['max_score'],
			max_duration = response_data['max_duration'],
			tournament_id = response_data['tournament_id']
		)
	except Exception as e:
		return JsonResponse(status = 400, data = {'message' : f"Match creation: {e}"})

	# writing the new match data in the response
	try:
		match_list = Match.objects.filter(Q(id=match.id))
		serializer = MatchDisplaySerializer(match_list, many=True, context={'user_id': response_data.get('user1')}, fields=['id', 'game','main_player_username', 'opponent_username','max_score', 'max_duration', 'tournament_id'])
		response_data = {'message': MSG_MATCH_CREATION_SUCCESS, 'data':serializer.data}
		return JsonResponse(status = 200, data = response_data, safe=False)
	except Exception as e:
		match.delete()
		return JsonResponse(status = 500, data = {'message': f"match created but failed to be displayed. Match canceled.\n[{e}]"})


@swagger_auto_schema(
	method='post',
	operation_description = "start a new match between 2 verified users (designated by their id)",
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		properties={
			'player1': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="first player id", example=11),
			'player2': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="second player id", example=3),
			'game': openapi.Schema(
				type=openapi.TYPE_STRING, description="game symbol, either \"FB\" or \"PG\"", example="PG"),
			'max_score': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="game max score (points for pong and number of deaths for Flappy bird), -1 if infinite", example=-1),
			'max_duration': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="game max duration in seconds, -1 if infinite", example=60),
			'tournament_id': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="tournament id, -1 if the match is started independently of any tournament", example=6),
		},
		required=['player1', 'player2', 'game', 'max_score', 'max_duration', 'tournament_id']
		),
	responses = {
		200: DOC_CREATION_MATCHES,
		'400 (0)': doc_error_generation("expect json body", MSG_ERROR_JSON_FORMAT),
		'400 (1)': doc_error_generation("missing player1", MSG_ERROR_MATCH_CREATION_MISSING_PLAYER1),
		'400 (2)': doc_error_generation("missing player2", MSG_ERROR_MATCH_CREATION_MISSING_PLAYER2),
		'400 (3)': doc_error_generation("wrong/missing game", MSG_ERROR_MATCH_CREATION_WRONG_GAME),
		'400 (4)': doc_error_generation("missing score", MSG_ERROR_MATCH_CREATION_MISSING_SCORE),
		'400 (5)': doc_error_generation("missing duration", MSG_ERROR_MATCH_CREATION_MISSING_DURATION),
		'400 (6)': doc_error_generation("incorrect data format/value", "Match creation: {different errors from the serializer}"),
		500: doc_error_generation("data recuperation fail, match canceled", "match created but failed to be displayed. Match canceled.\n[{more details here}]")
	})
@api_view(['POST'])
def new_match_verified_id(request):
	#extracting from the request the data required for the match creation
	try:
		json_data = json.loads(request.body)
	except:
		return JsonResponse(status = 400, data = {'message': MSG_ERROR_JSON_FORMAT})
	match_data = {}
	match_data['user1'] = json_data.get('player1')
	match_data['user2'] = json_data.get('player2')
	match_data['game'] = json_data.get('game')
	match_data['max_score'] = json_data.get('max_score')
	match_data['max_duration'] = json_data.get('max_duration')
	match_data['tournament_id'] = json_data.get('tournament_id')

	if not match_data.get('user1') and match_data.get('user1') != 0: 
		return JsonResponse(status = 400, data = {'message' : MSG_ERROR_MATCH_CREATION_MISSING_PLAYER1})
	if not match_data.get('user2') and match_data.get('user2') != 0: 
		return JsonResponse(status = 400, data = {'message' : MSG_ERROR_MATCH_CREATION_MISSING_PLAYER2})
	if not 'game' in match_data or (match_data['game'] != 'FB' and match_data['game'] != 'PG'):
		return JsonResponse(status = 400, data = {'message' : MSG_ERROR_MATCH_CREATION_WRONG_GAME})
	if not match_data.get('max_score') and match_data.get('max_score') != 0: 
		return JsonResponse(status = 400, data = {'message' : MSG_ERROR_MATCH_CREATION_MISSING_SCORE})
	if not match_data.get('max_duration')  and match_data.get('max_duration') != 0:
		return JsonResponse(status = 400, data = {'message' : MSG_ERROR_MATCH_CREATION_MISSING_DURATION})
	if match_data.get('user1') == match_data.get('user2'):
		return JsonResponse(status = 400, data = {'message' : MSG_ERROR_PLAYER_ID})

	# match creation
	return create_new_match(match_data)

