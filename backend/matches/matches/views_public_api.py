from django.http import JsonResponse

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from matches.models import Match
from matches.serializer import MatchSerializer, MatchHistorySerializer

from django.db.models import Q
from django.conf import settings
from django.core.exceptions import BadRequest
import requests
import json

from matches.views_users_requests import get_authenticated_user_id, get_authenticated_user_id_or_new_guest, get_new_ai_request, get_new_guest_request, check_player_pin_ok
from matches.views_tournaments_requests import is_host_of_tournament


# === Historic display ===

@api_view(['GET'])
def match_history(request):
	authentication_check_response = get_authenticated_user_id(request)
	response_data = authentication_check_response['data']
	response_status = authentication_check_response['status']
	if response_status != 200:
		return JsonResponse(status = response_status, data = response_data, safe=False)
	if response_data.get('is_logged') == False:
		response_data = {'message':'can\'t access the historic without being identified as a player'}
		return JsonResponse(status = 403, data = response_data, safe=False)
	user_id = response_data.get('user_id')
	matches = Match.objects.filter((Q(user1=user_id) | Q(user2=user_id)) & Q(is_finished=True))
	try:
		serializer= MatchHistorySerializer(matches, many=True, context={'user_id': user_id}, fields=['game', 'date', 'duration', 'main_player_username', 'opponent_username', 'main_player_score', 'opponent_score'])
		response_data = {'message':'matches history', 'matches':serializer.data}
		return JsonResponse(status = 200, data = response_data, safe=False)
	except:
		response_data = {'message':'failed to display the matches history'}
		return JsonResponse(status = 500, data = response_data, safe=False)



#  === New game ===

def generate_request_data_with_players(request, player_id1, player_id2):
	try:
		json_data = json.loads(request.body)
	except:
		return {'status': 400, 'data': {'message': 'Expecting a json body for creating a new match'}}
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


@api_view(['POST'])
def new_match_against_ai(request):
	authentication_check_response = get_authenticated_user_id_or_new_guest(request)
	if authentication_check_response['status'] != 200:
		return JsonResponse(status = authentication_check_response['status'], data= authentication_check_response, safe=False)
	user_id = authentication_check_response['data'].get('user_id')

	ai_generation_response = get_new_ai_request()
	if ai_generation_response['status'] != 200:
		return JsonResponse(status = ai_generation_response['status'], data= ai_generation_response, safe=False)
	ai_id = ai_generation_response['data'].get("ai_id")

	new_match_request_data = generate_request_data_with_players(request, user_id, ai_id)
	if new_match_request_data['status'] != 200:
		return JsonResponse(status = new_match_request_data['status'], data = new_match_request_data)
	new_match_creation = send_request_for_new_match(new_match_request_data['data'])
	return JsonResponse(status = new_match_creation['status'], data= new_match_creation['data'])


@api_view(['POST'])
def new_match_against_guest(request):
	authentication = get_authenticated_user_id_or_new_guest(request)
	if authentication['status'] != 200:
		return JsonResponse(status = authentication['status'], data = authentication['data'], safe=False)
	user_id = authentication['data'].get('user_id')

	new_guest_response = get_new_guest_request()
	if new_guest_response['status'] != 200:
		return JsonResponse(status = new_guest_response['status'], data = new_guest_response['data'], safe=False)
	guest_id = new_guest_response['data'].get("guest_id")

	new_match_request_data = generate_request_data_with_players(request, user_id, guest_id)
	if new_match_request_data['status'] != 200:
		return JsonResponse(status = new_match_request_data['status'], data = new_match_request_data['data'])
	response_data = send_request_for_new_match(new_match_request_data['data'])
	return JsonResponse(status = response_data['status'], data = response_data['data'])



@api_view(['POST'])
def new_match_against_player(request):
	authentication = get_authenticated_user_id_or_new_guest(request)
	if authentication['status'] != 200:
		return JsonResponse(status = authentication['status'], data = authentication['data'], safe=False)
	user_id = authentication.get('user_id')

	player2_id = request.POST.get('player2_id')
	player2_pin = request.POST.get('player2_pin')
	if player2_id == None or player2_pin == None:
		return JsonResponse(status = 400, data = {'message' : 'match creation impossible: missing id or pin for the second player'})
	check_second_player = check_player_pin_ok(player2_id, player2_pin)
	if check_second_player['status'] != 200:
		return JsonResponse(status = check_second_player['status'], data = check_second_player['data'], safe=False)
	if check_second_player['data'].get('valid') != True:
		return JsonResponse(status =  400, data = {'message' : 'match creation impossible: wrong pin for the second player'})
	
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
		updatable = host_check['data']['is_host']
	else:
		updatable = request_emitter_id == match_instance.user1 or request_emitter_id == match_instance.user2
	return {'status': 200, 'data': {'is_updatable': updatable}}

def is_match_finishable(request, match_instance):
	match_updatability = can_update_match(request, match_instance)
	if match_updatability['status'] != 200:
		return match_updatability
	if match_updatability['data']['is_updatable'] == False:
		return {'status':403, 'data': {'message' : f"a match can be declared as finished only by its players or the tournament creator"}}
	print(f"finished: {match_instance.is_finished}")
	if match_instance.is_finished:
		return {'status': 403, 'data': {'message' : f"the match was already finished"}}
	return {'status': 200}

@api_view(['POST'])
def finish_match(request, match_id):
	try:
		match_instance = Match.objects.get(id = match_id)
	except:
		return JsonResponse(status = 400, data = {'message' : f"there is no match identified by the id {match_id} to be ended"})

	match_finishable = is_match_finishable(request, match_instance)
	if match_finishable['status'] != 200:
		return JsonResponse(status = match_finishable['status'], data = match_finishable['data'])

	# check the existence of the required fields (not their )
	data = request.data
	if not 'score1' in data or not 'score2' in data or not 'duration' in data :
		return JsonResponse(status = 400, data = {'message' : 'missing "score1" or "score2" or "duration" field to successfully end a match'})
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
		return JsonResponse(status = 400, data = {'message' : f"match finish: {e}"})

	# if match_instance.tournament_id:
		# TODO: send the request to the users microservice to clean the ai/guest user of this match if needed. returns the player1 and player2 updated id. They would be updated in the match data
	return JsonResponse(status = 200, data = {'message': f"{match_instance} successfully ended"})
