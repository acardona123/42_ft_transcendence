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

@api_view(['POST'])
def new_match_verified_id(request, player_id1, player_id2):

	request_game = request.POST.get('game')
	request_max_score = request.POST.get('max_score')
	request_max_duration = request.POST.get('max_duration')
	request_clean_when_finished = request.POST.get('clean_when_finished')
	if not request_game or (request_game != 'FB' and request_game != 'PG'):
		return Response({'message' : 'Wrong/missing game identifier'},
			status=status.HTTP_400_BAD_REQUEST)
	if not request_max_score: 
		return Response({'message' : 'Match max score not provide'},
			status=status.HTTP_400_BAD_REQUEST)
	if not request_max_duration:
		return Response({'message' : 'Match max duration not provide'},
			status=status.HTTP_400_BAD_REQUEST)
	if request_clean_when_finished == None :
		return Response({'message' : 'Match clean when finished indication not provide'},
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
	try:
		serializer = MatchSerializer(match, context={'user_id': player_id1}, fields=['game', 'date', 'duration', 'main_player_username', 'opponent_username', 'main_player_score', 'opponent_score'])
		print(serializer.data)
		data = {'status':200, 'message':'matches created', 'match_data':serializer.data}
		return JsonResponse(data, safe=False)

	except:
		return Response({'message': 'retrieving match data'},
			status=status.HTTP_500_INTERNAL_SERVER_ERROR)
