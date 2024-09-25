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

from matches.views_private_api import new_match_verified_id
from matches.views_users_requests import get_authenticated_user_id, get_authenticated_user_id_or_new_guest, get_new_ai_request, get_new_guest_request, check_player_pin_ok


# === Historic display ===

@api_view(['GET'])
def match_history(request):
	authentication_check_response = get_authenticated_user_id(request)
	if authentication_check_response.get('status') != 200:
		return JsonResponse(authentication_check_response, safe=False)
	if authentication_check_response.get('is_logged') == False:
		data = {'status': 403, 'message':'can\'t access the historic without being identified as a player'}
		return JsonResponse(data, safe=False)
	user_id = authentication_check_response.get('user_id')
	matches = Match.objects.filter((Q(user1=user_id) | Q(user2=user_id)) & Q(is_finished=True))
	try:
		serializer= MatchHistorySerializer(matches, many=True, context={'user_id': user_id}, fields=['game', 'date', 'duration', 'main_player_username', 'opponent_username', 'main_player_score', 'opponent_score'])
		data = {'status':200, 'message':'matches history', 'matches':serializer.data}
		return JsonResponse(data, safe=False)
	except:
		data = {'status': 500, 'message':'failed to display the matches history'}
		return JsonResponse(data, safe=False)



#  === New game ===

def generate_request_data_with_players(request, player_id1, player_id2):
	try:
		json_data = json.loads(request.body)
	except:
		return JsonResponse({'status': 400,'message': 'Expecting a json body for creating a new match'})
	request_body = {}
	request_body['game'] = json_data.get('game')
	request_body['max_score'] = json_data.get('max_score')
	request_body['max_duration'] = json_data.get('max_duration')
	request_body['clean_when_finished'] = json_data.get('clean_when_finished')
	request_body['player1'] = player_id1
	request_body['player2'] = player_id2
	return {'status': 200, 'data': request_body}

def send_request_for_new_match(request_data):
	url = f"{settings.MATCHES_MICROSERVICE_URL}/private_api/matches/new_match_verified_id"
	data = request_data
	response = requests.post(url, data=json.dumps(data))
	data = response.json()
	return data


@api_view(['POST'])
def new_match_against_ai(request):
	authentication_check_response = get_authenticated_user_id_or_new_guest(request)
	if authentication_check_response.get('status') != 200:
		return JsonResponse(authentication_check_response, safe=False)
	user_id = authentication_check_response.get('user_id')

	ai_generation_response = get_new_ai_request()
	if ai_generation_response.get('status') != 200:
		return JsonResponse(ai_generation_response, safe=False)
	ai_id = ai_generation_response.get("ai_id")

	new_match_request_data = generate_request_data_with_players(request, user_id, ai_id)
	if new_match_request_data['status'] != 200:
		return Response(new_match_request_data)
	response_data = send_request_for_new_match(new_match_request_data['data'])
	return JsonResponse(response_data)


@api_view(['POST'])
def new_match_against_guest(request):
	authentication_check_response = get_authenticated_user_id_or_new_guest(request)
	if authentication_check_response.get('status') != 200:
		return JsonResponse(authentication_check_response, safe=False)
	user_id = authentication_check_response.get('user_id')

	guest_generation_response = get_new_guest_request()
	if guest_generation_response.get('status') != 200:
		return JsonResponse(guest_generation_response, safe=False)
	guest_id = guest_generation_response.get("guest_id")


	new_match_request_data = generate_request_data_with_players(request, user_id, guest_id)
	if new_match_request_data['status'] != 200:
		return Response(new_match_request_data)
	response_data = send_request_for_new_match(new_match_request_data['data'])
	return JsonResponse(response_data)



@api_view(['POST'])
def new_match_against_player(request):
	authentication_check_response = get_authenticated_user_id_or_new_guest(request)
	if authentication_check_response.get('status') != 200:
		return JsonResponse(authentication_check_response, safe=False)
	user_id = authentication_check_response.get('user_id')

	player2_id = request.POST.get('player2_id')
	player2_pin = request.POST.get('player2_pin')
	if player2_id == None or player2_pin == None:
		return Response({'status': 400,'error' : 'match creation impossible: missing id or pin for the second player'})
	check_second_player = check_player_pin_ok(player2_id, player2_pin)
	if check_second_player.get('status') != 200:
		return JsonResponse(check_second_player, safe=False)
	if check_second_player.get('valid') != True:
		return Response({'status': 400, 'error' : 'match creation impossible: wrong pin for the second player'})
	
	new_match_request_data = generate_request_data_with_players(request, user_id, player2_id)
	if new_match_request_data['status'] != 200:
		return Response(new_match_request_data)
	response_data = send_request_for_new_match(new_match_request_data['data'])
	return JsonResponse(response_data)



@api_view(['POST'])
def finish_match(request, match_id):
	try:
		match_instance = Match.objects.get(id = match_id)
	except:
		return Response({'status': 400,'error' : f"there is no match identified by the id ${match_id} to be ended"})
	if match_instance.is_finished:
		return Response({'status': 200,'error' : f"the match ${match_id} was already finished"})

	data = request.data
	if not 'score1' in request or not 'score2' in request or not 'duration' in request :
		return Response({'status': 400,'error' : 'missing "score1" or "score2" or "duration" field to successfully end a match'})
	request_score1 = request.POST.get('score1')
	request_score2 = request.POST.get('score2')
	request_duration = request.POST.get('duration')
	try:
		match_instance.update(score1 = request_score1, score2 = request_score2, duration = request_duration, is_finished = True)
	except Exception as e:
		return Response({'status': 400,'error' : f"match finish: {e}"})

	# if match_instance.clean_when_finished:
		# TODO: send the request to the users microservice to clean the ai/guest user of this match if needed. returns the player1 and player2 updated id
