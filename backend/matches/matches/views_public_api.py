from django.http import JsonResponse

from rest_framework import status
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


@api_view(['POST'])
def new_match_against_ai(request):
	authentication_check_response = get_authenticated_user_id_or_new_guest(request)
	if authentication_check_response.get('status') != 200:
		return JsonResponse(authentication_check_response, safe=False)
	user_id = authentication_check_response.get('user_id')

	ai_generation_response = get_new_ai_request()
	if ai_generation_response.get('status') != 200:
		return JsonResponse(ai_generation_response, safe=False)
	ai_id = ai_generation_response.get("id")
	return new_match_verified_id(request, user_id, ai_id)



@api_view(['POST'])
def new_match_against_guest(request):
	authentication_check_response = get_authenticated_user_id_or_new_guest(request)
	if authentication_check_response.get('status') != 200:
		return JsonResponse(authentication_check_response, safe=False)
	user_id = authentication_check_response.get('user_id')

	guest_generation_response = get_new_guest_request()
	if guest_generation_response.get('status') != 200:
		return JsonResponse(guest_generation_response, safe=False)
	guest_id = guest_generation_response.get("id")
	return new_match_verified_id(request, user_id, guest_id)



@api_view(['POST'])
def new_match_against_player(request):
	authentication_check_response = get_authenticated_user_id_or_new_guest(request)
	if authentication_check_response.get('status') != 200:
		return JsonResponse(authentication_check_response, safe=False)
	user_id = authentication_check_response.get('user_id')

	player2_id = request.POST.get('player2_id')
	player2_pin = request.POST.get('player2_pin')
	if player2_id == None or player2_pin == None:
		return Response({'error' : 'match creation impossible: missing id or pin for the second player'},
			status=status.HTTP_400_BAD_REQUEST)
	check_second_player = check_player_pin_ok(player2_id, player2_pin)
	if check_second_player.get('status') != 200:
		return JsonResponse(check_second_player, safe=False)
	if check_second_player.get('valid') != True:
		return Response({'error' : 'match creation impossible: wrong pin for the second player'},
			status=status.HTTP_400_BAD_REQUEST)
	
	return new_match_verified_id(request, user_id, player2_id)