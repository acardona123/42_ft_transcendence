from django.http import JsonResponse

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from matches.models import Match
from matches.serializer import MatchSerializer, MatchDisplaySerializer

from django.db.models import Q
from django.conf import settings
from django.core.exceptions import BadRequest
import requests
import json

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from matches.views_users_requests import get_authenticated_user_id, get_authenticated_user_id, get_new_ai_request, get_new_guest_request, check_player_pin_ok
from matches.views_tournaments_requests import is_host_of_tournament

# -----------------------SWAGGER(DOC)---------------------------

MSG_ERROR_UNIDENTIFIED_USER = 'can\'t access the historic without being identified as a player'
MSG_ERROR_JSON_FORMAT = 'Expecting a json body for creating a new match'

MSG_LIST_ERROR_SERIALIZER_DISPLAY = 'failed to display the matches history'
MSG_LIST_SUCCESS = 'matches history'
DOC_LIST_MATCHES = openapi.Response(
			description=MSG_LIST_SUCCESS,
			examples={
				"application/json": {
					"message": MSG_LIST_SUCCESS,
					"matches": [
						{
						"game": "FB",
						"date": "2024-10-15T17:18:12.666123Z",
						"duration": 150,
						"main_player_username": "username_id_7",
						"opponent_username": "username_id_3",
						"main_player_score": 15,
						"opponent_score": 7
						},
						{
						"game": "PG",
						"date": "2024-10-15T17:18:12.666104Z",
						"duration": 127,
						"main_player_username": "username_id_7",
						"opponent_username": "username_id_4",
						"main_player_score": 8,
						"opponent_score": 19
						}
					]
				}
			}
		)

MSG_NEW_MATCH_ERROR_MISSING_FIELD = 'match creation impossible: missing username or pin for the second player'
MSG_NEW_MATCH_ERROR_WRONG_PIN = 'match creation impossible: wrong pin for the second player'

MSG_FINISH_MATCH_ERROR_ID_NOT_FOUND = 'there is no match identified by the given id to be ended'
MSG_FINISH_MATCH_ERROR_NOT_ALLOWED = 'a match can be declared as finished only by its players or the creator of the tournament'
MSG_FINISH_MATCH_ERROR_ALREADY_FINISHED = 'the match was already finished'
MSG_FINISH_MATCH_ERROR_MISSING_FIELD = 'missing "score1" or "score2" or "duration" field to successfully end a match'

def doc_error_generation(err_description, err_msg):
	return (openapi.Response(
				description="Error: " + err_description,
				examples={
					"application/json": {
						"message": err_msg
					}
				})
			)




# === Historic display ===
@swagger_auto_schema(
	method='get',
	responses={
		200: DOC_LIST_MATCHES,
		403: doc_error_generation("unidentified user", MSG_ERROR_UNIDENTIFIED_USER),
		500: doc_error_generation("serializer display", MSG_LIST_ERROR_SERIALIZER_DISPLAY)
		# ???: error form the authentication, should be impossible with jwt tockens...
	})
@api_view(['GET'])
def match_history(request):
	authentication_check_response = get_authenticated_user_id(request)
	response_data = authentication_check_response['data']
	response_status = authentication_check_response['status']
	if response_status != 200:
		return JsonResponse(status = response_status, data = response_data, safe=False)
	if response_data.get('is_logged') == False:
		response_data = {'message': MSG_ERROR_UNIDENTIFIED_USER}
		return JsonResponse(status = 403, data = response_data, safe=False)
	user_id = response_data.get('user_id')
	matches = Match.objects.filter((Q(user1=user_id) | Q(user2=user_id)) & Q(is_finished=True))
	try:
		serializer= MatchDisplaySerializer(matches, many=True, context={'user_id': user_id}, fields=['game', 'date', 'duration', 'main_player_username', 'opponent_username', 'main_player_score', 'opponent_score'])
		response_data = {'message': MSG_LIST_SUCCESS, 'matches':serializer.data}
		return JsonResponse(status = 200, data = response_data, safe=False)
	except:
		response_data = {'message':MSG_LIST_ERROR_SERIALIZER_DISPLAY}
		return JsonResponse(status = 500, data = response_data, safe=False)



#  === New game ===

def generate_request_data_with_players(request, player_id1, player_id2):
	try:
		json_data = json.loads(request.body)
	except:
		return {'status': 400, 'data': {'message': MSG_ERROR_JSON_FORMAT}}
	request_body = {}
	request_body['game'] = json_data.get('game')
	request_body['max_score'] = json_data.get('max_score')
	request_body['max_duration'] = json_data.get('max_duration')
	request_body['tournament_id'] = json_data.get('tournament_id')
	request_body['player1'] = player_id1
	request_body['player2'] = player_id2
	return {'status': 200, 'data': request_body}

def send_request_for_new_match(request_data):
	url = f"{settings.MATCHES_MICROSERVICE_URL}/private_api/matches/new_match_verified_id/"
	data = request_data
	response = requests.post(url, data=json.dumps(data))
	response_status = response.status_code
	response_content = response.json()
	return {'status': response_status, 'data': response_content}

@swagger_auto_schema(
	method='post',
	operation_description = "start a new match against a bot",
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		properties={
			'game': openapi.Schema(
				type=openapi.TYPE_STRING, description="game symbol, either \"FB\" or \"PG\"", example="FB"),
			'max_score': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="game max score (points for pong and number of deaths for Flappy bird), -1 if infinite", example=10),
			'max_duration': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="game max duration in seconds, -1 if infinite", example=-1),
			'tournament_id': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="tournament id, -1 if the match is started independently of any tournament", example=-1),
		},
		required=['game', 'max_score', 'max_duration', 'tournament_id']
		),
	responses = {
		200: "see the response 200 of private_api/matches/new_match_verified_id/",
		# ???: error form the authentication, should be impossible with jwt tockens...
		403: doc_error_generation("unidentified user", MSG_ERROR_UNIDENTIFIED_USER),
		400: doc_error_generation("json body", MSG_ERROR_JSON_FORMAT),
		'400/401/404/...': 'all the error returns of user/api/users/new/ai',
		'400/500': "see all the error messages of private_api/matches/new_match_verified_id/" 
	})
@api_view(['POST'])
def new_match_against_ai(request):
	authentication_check_response = get_authenticated_user_id(request)
	response_data = authentication_check_response['data']
	response_status = authentication_check_response['status']
	if response_status != 200:
		return JsonResponse(status = response_status, data= response_data, safe=False)
	if response_data.get('is_logged') == False:
		response_data = {'message': MSG_ERROR_UNIDENTIFIED_USER}
		return JsonResponse(status = 403, data = response_data, safe=False)
	user_id = response_data.get('user_id')

	ai_generation_response = get_new_ai_request()
	if ai_generation_response['status'] != 200:
		return JsonResponse(status = ai_generation_response['status'], data= ai_generation_response, safe=False)
	ai_id = ai_generation_response['data'].get("ai_id")

	new_match_request_data = generate_request_data_with_players(request, user_id, ai_id)
	if new_match_request_data['status'] != 200:
		return JsonResponse(status = new_match_request_data['status'], data = new_match_request_data)
	new_match_creation = send_request_for_new_match(new_match_request_data['data'])
	return JsonResponse(status = new_match_creation['status'], data= new_match_creation['data'])


@swagger_auto_schema(
	method='post',
	operation_description = "start a new match against a guest",
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		properties={
			'game': openapi.Schema(
				type=openapi.TYPE_STRING, description="game symbol, either \"FB\" or \"PG\"", example="PG"),
			'max_score': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="game max score (points for pong and number of deaths for Flappy bird), -1 if infinite", example=-1),
			'max_duration': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="game max duration in seconds, -1 if infinite", example=6),
			'tournament_id': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="tournament id, -1 if the match is started independently of any tournament", example=12),
		},
		required=['game', 'max_score', 'max_duration', 'tournament_id']
		),
	responses = {
		200: "see the response 200 of private_api/matches/new_match_verified_id/",
		# ???: error form the authentication, should be impossible with jwt tockens...
		403: doc_error_generation("unidentified user", MSG_ERROR_UNIDENTIFIED_USER),
		400: doc_error_generation("json body", MSG_ERROR_JSON_FORMAT),
		'400/401/404/...': 'all the error returns of user/api/users/new/guest',
		'400/500': "see all the error messages of private_api/matches/new_match_verified_id/" 
	})
@api_view(['POST'])
def new_match_against_guest(request):
	authentication_check_response = get_authenticated_user_id(request)
	response_data = authentication_check_response['data']
	response_status = authentication_check_response['status']
	if response_status != 200:
		return JsonResponse(status = response_status, data= response_data, safe=False)
	if response_data.get('is_logged') == False:
		response_data = {'message': MSG_ERROR_UNIDENTIFIED_USER}
		return JsonResponse(status = 403, data = response_data, safe=False)
	user_id = response_data.get('user_id')

	new_guest_response = get_new_guest_request()
	if new_guest_response['status'] != 200:
		return JsonResponse(status = new_guest_response['status'], data = new_guest_response['data'], safe=False)
	guest_id = new_guest_response['data'].get("guest_id")

	new_match_request_data = generate_request_data_with_players(request, user_id, guest_id)
	if new_match_request_data['status'] != 200:
		return JsonResponse(status = new_match_request_data['status'], data = new_match_request_data['data'])
	response_data = send_request_for_new_match(new_match_request_data['data'])
	return JsonResponse(status = response_data['status'], data = response_data['data'])


@swagger_auto_schema(
	method='post',
	operation_description = "start a new match against another player identified by its username and pin",
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		properties={
			'game': openapi.Schema(
				type=openapi.TYPE_STRING, description="game symbol, either \"FB\" or \"PG\"", example="FB"),
			'player2_username': openapi.Schema(
				type=openapi.TYPE_STRING, description="game max score (points for pong and number of deaths for Flappy bird), -1 if infinite", example="a_username"),
			'player2_pin': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="game max score (points for pong and number of deaths for Flappy bird), -1 if infinite", example="1234"),
			'max_score': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="game max score (points for pong and number of deaths for Flappy bird), -1 if infinite", example=-1),
			'max_duration': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="game max duration in seconds, -1 if infinite", example=12),
			'tournament_id': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="tournament id, -1 if the match is started independently of any tournament", example=-1),
		},
		required=['game', 'player2_username', 'player2_pin','max_score', 'max_duration', 'tournament_id']
		),
	responses = {
		200: "see the response 200 of private_api/matches/new_match_verified_id/",
		# ???: error form the authentication, should be impossible with jwt tockens...
		403: doc_error_generation("unidentified user", MSG_ERROR_UNIDENTIFIED_USER),
		'400 (0)': doc_error_generation("json body", MSG_ERROR_JSON_FORMAT),
		'400 (1)': doc_error_generation("missing field", MSG_NEW_MATCH_ERROR_MISSING_FIELD),
		'400/401/404/...': 'all the error returns of user/api/users/ ??????????check player pin ?????????????????',
		'400 (2)': doc_error_generation("wrong pin", MSG_NEW_MATCH_ERROR_WRONG_PIN),
		'400/500': "see all the error messages of private_api/matches/new_match_verified_id/" ,
	})
@api_view(['POST'])
def new_match_against_player(request):
	authentication_check_response = get_authenticated_user_id(request)
	response_data = authentication_check_response['data']
	response_status = authentication_check_response['status']
	if response_status != 200:
		return JsonResponse(status = response_status, data= response_data, safe=False)
	if response_data.get('is_logged') == False:
		response_data = {'message': MSG_ERROR_UNIDENTIFIED_USER}
		return JsonResponse(status = 403, data = response_data, safe=False)
	user_id = response_data.get('user_id')

	try:
		json_data = json.loads(request.body)
	except:
		return JsonResponse(400, data = {'message': MSG_ERROR_JSON_FORMAT}, safe=False)
	
	player2_username = json_data.get('player2_username')
	player2_pin = json_data.get('player2_pin')
	if player2_username == None or player2_pin == None:
		return JsonResponse(status = 400, data = {'message' : MSG_NEW_MATCH_ERROR_MISSING_FIELD})
	check_second_player = check_player_pin_ok(player2_username, player2_pin)
	if check_second_player['status'] != 200:
		return JsonResponse(status = check_second_player['status'], data = check_second_player['data'], safe=False)
	if check_second_player['data']['data'].get('valid') != True:
		return JsonResponse(status =  400, data = {'message' : MSG_NEW_MATCH_ERROR_WRONG_PIN})
	player2_id = check_second_player['data']['data'].get('user_id')
	
	new_match_request_data = generate_request_data_with_players(request, user_id, player2_id)
	if new_match_request_data['status'] != 200:
		return JsonResponse(status = new_match_request_data['status'], data = new_match_request_data['data'])
	response_data = send_request_for_new_match(new_match_request_data['data'])
	return JsonResponse(status = response_data['status'], data = response_data['data'])


def can_update_match(request, match_instance):
	request_emitter_id = 7 #here the request emitter id will be deduced based on the jwt token
	if match_instance.tournament_id >= 0:
		host_check = is_host_of_tournament(match_instance.tournament_id, request_emitter_id)
		if host_check['status'] != 200:
			return host_check
		updatable = host_check['data']['data']['is_host']
	else:
		updatable = request_emitter_id == match_instance.user1 or request_emitter_id == match_instance.user2
	return {'status': 200, 'data': {'is_updatable': updatable}}

def is_match_finishable(request, match_instance):
	match_updatability = can_update_match(request, match_instance)
	if match_updatability['status'] != 200:
		return match_updatability
	if match_updatability['data']['is_updatable'] == False:
		return {'status':403, 'data': {'message' : MSG_FINISH_MATCH_ERROR_NOT_ALLOWED}}
	print(f"finished: {match_instance.is_finished}")
	if match_instance.is_finished:
		return {'status': 403, 'data': {'message' : MSG_FINISH_MATCH_ERROR_ALREADY_FINISHED}}
	return {'status': 200}

@swagger_auto_schema(
	method='post',
	operation_description = "finish a match and saving its scores and duration",
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		properties={
			'score1': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="score of the first player", example=55),
			'score2': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="score of the second player", example=4),
			'duration': openapi.Schema(
				type=openapi.TYPE_INTEGER, description="match duration", example=120),
		},
		required=['score1', 'score2', 'duration']
		),
	responses = {
		200: "match {id} successfully ended",
		'400 (0)': doc_error_generation('unknown match id', MSG_FINISH_MATCH_ERROR_ID_NOT_FOUND),
		'400 (1)': doc_error_generation('missing field', MSG_FINISH_MATCH_ERROR_MISSING_FIELD),
		'400 (2)': "Error from the serializer if one of the field format/value is incorrect",
		'403 (0)': doc_error_generation('already_finished', MSG_FINISH_MATCH_ERROR_ALREADY_FINISHED),
		'403 (1)': doc_error_generation("user not allowed to finish the match", MSG_FINISH_MATCH_ERROR_NOT_ALLOWED),
		'400/401/404/...': 'all errors from tournaments/private_api/is_host/{tournament_id}/{user_id}',
	})
@api_view(['POST'])
def finish_match(request, match_id):
	try:
		match_instance = Match.objects.get(id = match_id)
	except:
		return JsonResponse(status = 400, data = {'message' : MSG_FINISH_MATCH_ERROR_ID_NOT_FOUND})

	match_finishable = is_match_finishable(request, match_instance)
	if match_finishable['status'] != 200:
		return JsonResponse(status = match_finishable['status'], data = match_finishable['data'])

	# check the existence of the required fields (not their )
	data = request.data
	if not 'score1' in data or not 'score2' in data or not 'duration' in data :
		return JsonResponse(status = 400, data = {'message' : MSG_FINISH_MATCH_ERROR_MISSING_FIELD})
	request_score1 = data.get('score1')
	request_score2 = data.get('score2')
	request_duration = data.get('duration')
	# print(f"request_score1 = {request_score1}")
	# print(f"request_score2 = {request_score2}")
	# print(f"request_duration = {request_duration}"

	try:
		match_instance.score1 = request_score1
		match_instance.score2 = request_score2
		match_instance.duration = request_duration
		match_instance.is_finished = True
		match_instance.save()
	except Exception as e:
		return JsonResponse(status = 400, data = {'message' : f"Error when trying to finish the match: {e}"})

	# if match_instance.tournament_id:
		# TODO: send the request to the users microservice to clean the ai/guest user of this match if needed. returns the player1 and player2 updated id. They would be updated in the match data
	return JsonResponse(status = 200, data = {'message': f"Match {match_instance.id} successfully ended"})
