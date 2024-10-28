from rest_framework.decorators import api_view, permission_classes
from .authentication import IsNormalToken
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Tournament, Participant
from django.conf import settings
from .serializer import TournamentSerializer
from .utils import dispatch_player
import requests
import random
import tournaments.doc as doc
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from django.contrib.auth.models import AnonymousUser

def get_tournament_id(request, query_string, status):
	if query_string:
		tournament_id = request.query_params.get('tournament_id', None)
	else:
		tournament_id = request.data.get('tournament_id', None)
	if tournament_id is None:
		return Response({"message": doc.MSG_ERROR_TOURNAMENT_ID_REQUIRED},
					status=400)
	try:
		tournament = Tournament.objects.get(id=tournament_id)
		if not isinstance(request.user, AnonymousUser) and tournament.host != request.user.id:
			raise
		if tournament.status != status:
			raise
		return tournament
	except:
		return Response({"message": doc.MSG_ERROR_INVALID_TOURNAMENT_ID}, status=400)

@swagger_auto_schema(method='post',
	manual_parameters=[doc.JWT_TOKEN],
	responses={
		200: doc.DOC_CREATE_TRN,
		500: doc.DOC_ERROR_CREATE_TRN,
		401: doc.DOC_ERROR_UNAUTHORIZED,
		405: doc.DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
@permission_classes([IsNormalToken])
def create_tournament(request):
	try:
		tournament = Tournament.objects.create(host=request.user.id)
		tournament.participant_set.create(user=request.user.id, type=Participant.UserType.USER)
		return Response({"message": doc.MSG_TOURNAMENT_CREATED,
						"data": {"tournament_id": tournament.id}}, status=200)
	except:
		return Response({"message": doc.MSG_ERROR_CREATE_TOURNAMENT}, status=500)

def add_participant(tournament, user_id, username):
	if tournament.participant_set.filter(user=user_id).exists():
		player = tournament.participant_set.get(user=user_id)
		return Response({'message': doc.MSG_ERROR_PLAYER_TRN,
				"data": {"username":username, "player_id": player.id}}, status=200)
	try:
		participant = tournament.participant_set.create(user=user_id, type=Participant.UserType.USER)
		return Response({"message": doc.MSG_PLAYER_ADD,
						"data": {"username": username, "player_id": participant.id}}, status=201)
	except:
		return Response({"message": doc.MSG_ERROR_PLAYER_TRN_FAIL},
					status=500)
	
class ManagePlayer(APIView):
	permission_classes = [IsNormalToken]

	@swagger_auto_schema(
		manual_parameters=[doc.JWT_TOKEN],
		request_body=openapi.Schema(
			type=openapi.TYPE_OBJECT,
			required=['username','pin', 'tournament_id'],
			properties={
				'tournament_id': openapi.Schema(type=openapi.TYPE_STRING),
				'username': openapi.Schema(type=openapi.TYPE_STRING),
				'pin': openapi.Schema(type=openapi.TYPE_STRING)
			}
		),
		responses={
			200: doc.DOC_PLAYER_ALREADY_TRN,
			201: doc.DOC_PLAYER_TRN,
			'400(0)': doc.DOC_ERROR_USERNAME_PIN,
			'400(1)': doc.DOC_ERROR_TRN_ID,
			401: doc.DOC_ERROR_UNAUTHORIZED,
			405: doc.DOC_ERROR_METHOD_NOT_ALLOWED,
			500: doc.DOC_ERROR_ADD_PLAYER
		})
	def post(self, request):
		username = request.data.get("username", None)
		pin = request.data.get("pin", None)
		if username is None or pin is None:
			return Response({"message": doc.MSG_ERROR_USERNAME_PIN_REQUIRED},
						status=400)
		tournament = get_tournament_id(request, False, Tournament.GameStatus.CREATION)
		if isinstance(tournament, Response):
			return tournament
		url = settings.USERS_MICROSERVICE_URL + "/api/private/users/login/pin/"
		response = requests.post(url=url, data={"username":username, "pin":pin})
		response_json = response.json()
		if response.status_code != 200 or response_json['data'].get('valid') == False:
			return Response({"message": doc.MSG_INVALID_CRED}, status=401)
		user_id = response_json['data'].get('user_id')
		return add_participant(tournament, user_id, username)

	@swagger_auto_schema(
		manual_parameters=[doc.JWT_TOKEN, doc.PLAYER, doc.TOURNAMENT],
		responses={
			200: doc.DOC_REMOVE_PLAYER,
			'400(0)': doc.DOC_ERROR_PLAYER_REQUIRED,
			'400(1)': doc.DOC_ERROR_TRN_ID,
			'400(2)': doc.DOC_ERROR_REMOVE_HOST,
			401: doc.DOC_ERROR_UNAUTHORIZED,
			405: doc.DOC_ERROR_METHOD_NOT_ALLOWED
		})
	def delete(self, request):
		player_id = request.query_params.get('player_id', None)
		if player_id is None:
			return Response({"message": doc.MSG_ERROR_PLAYER_REQUIRED}, status=400)
		tournament = get_tournament_id(request, True, Tournament.GameStatus.CREATION)
		if isinstance(tournament, Response):
			return tournament
		if tournament.participant_set.filter(id=player_id).exists() == False:
			return Response({"message": doc.MSG_INVALID_PLAYER}, status=400)
		player = tournament.participant_set.get(id=player_id)
		if tournament.host == player.user:
			return Response({"message": doc.MSG_ERROR_REMOVE_HOST}, status=400)
		tournament.participant_set.filter(id=player_id).delete()
		return Response({"message": doc.MSG_REMOVE_PLAYER,
						"data": {"player_id": player_id}}, status=200)

@swagger_auto_schema(method='post',
	manual_parameters=[doc.JWT_TOKEN],
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['tournament_id', 'game', 'max_score', 'max_duration', 'nb_guest', 'nb_ai'],
		properties={
			'tournament_id': openapi.Schema(type=openapi.TYPE_STRING),
			'game': openapi.Schema(type=openapi.TYPE_STRING),
			'max_score': openapi.Schema(type=openapi.TYPE_STRING),
			'max_duration': openapi.Schema(type=openapi.TYPE_STRING),
			'nb_guest': openapi.Schema(type=openapi.TYPE_STRING),
			'nb_ai': openapi.Schema(type=openapi.TYPE_STRING)
		}
	),
	responses={
		200: doc.DOC_TRN_VALIDATE,
		'400(0)': doc.DOC_ERROR_TRN_VALID,
		'400(1)': doc.DOC_ERROR_TRN_ID,
		401: doc.DOC_ERROR_UNAUTHORIZED,
		405: doc.DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
@permission_classes([IsNormalToken])
def start_tournament(request):
	tournament = get_tournament_id(request, False, Tournament.GameStatus.CREATION)
	if isinstance(tournament, Response):
		return tournament
	nb_players = tournament.participant_set.count()
	serializer = TournamentSerializer(tournament, data=request.data,
							context={'nb_player': nb_players})
	if serializer.is_valid():
		serializer.save()
		return Response({"message": doc.MSG_TRN_VALID}, status=200)
	else:
		return Response({"message": doc.MSG_ERROR_TRN,
				"data": serializer.errors}, status=400)


@swagger_auto_schema(method='get',
	manual_parameters=[doc.JWT_TOKEN, doc.TOURNAMENT],
	responses={
		200: doc.DOC_GUEST,
		'400(0)': doc.DOC_ERROR_USERNAME,
		'400(1)': doc.DOC_ERROR_TRN_ID,
		401: doc.DOC_ERROR_UNAUTHORIZED,
		405: doc.DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['GET'])
@permission_classes([IsNormalToken])
def guest_list(request):
	tournament = get_tournament_id(request, True, Tournament.GameStatus.STARTED)
	if isinstance(tournament, Response):
		return tournament
	guests = tournament.participant_set.filter(type=Participant.UserType.GUEST)
	guests_id = [guest.user for guest in guests]
	url = settings.USERS_MICROSERVICE_URL+"/api/private/users/retrieve/usernames/"
	response = requests.post(url=url, json={"users_id": guests_id})
	if response.status_code != 200:
		return Response({"message": doc.MSG_ERROR_USERNAME}, status=400)
	data = response.json().get('data')
	username = [data.get(str(guest_id)) for guest_id in guests_id]
	return Response({'message': doc.MSG_GUEST_USERNAME, 'data': username}, status=200)

@swagger_auto_schema(method='get',
	manual_parameters=[doc.JWT_TOKEN, doc.TOURNAMENT],
	responses={
		200: doc.DOC_MATCH,
		'400(0)': doc.DOC_ERROR_USERNAME,
		'400(1)': doc.DOC_ERROR_TRN_ID,
		401: doc.DOC_ERROR_UNAUTHORIZED,
		405: doc.DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['GET'])
@permission_classes([IsNormalToken])
def get_match_for_round(request):
	tournament = get_tournament_id(request, True, Tournament.GameStatus.STARTED)
	if isinstance(tournament, Response):
		return tournament
	players = list(tournament.participant_set.filter(is_eliminated=False))
	players_id = [player.user for player in players]
	url = settings.USERS_MICROSERVICE_URL+"/api/private/users/retrieve/usernames/"
	response = requests.post(url=url, json={"users_id": players_id})
	if response.status_code != 200:
		return Response({"message": doc.MSG_ERROR_USERNAME}, status=400)
	data = response.json().get('data')
	matches = []
	for match in range(1, tournament.max_match + 1):
		players = list(tournament.participant_set.filter(match=match, is_eliminated=False))
		matches.append([data.get(str(player.user)) for player in players])
	return Response({"message": doc.MSG_MATCH,
					'data': {'matches': matches}}, status=200)

def create_match(tournament, players):
	is_player2_bot = False
	if players[0].type == Participant.UserType.BOT:
		players1 = players[1]
		players2 = players[0]
		is_player2_bot = True
	elif players[1].type == Participant.UserType.BOT:
		players1 = players[0]
		players2 = players[1]
		is_player2_bot = True
	else:
		players1 = players[0]
		players2 = players[1]

	players1.is_playing = True
	players1.position = 1
	players1.save()
	players2.is_playing = True
	players2.position = 2
	players2.save()
	url = settings.MATCHES_MICROSERVICE_URL+"/api/private/matches/new_match_verified_id/"
	data = {"player1": players1.user,
			"player2": players2.user,
			"game": tournament.game,
			"max_score": tournament.max_score,
			"max_duration": tournament.max_duration,
			"tournament_id": tournament.id}
	response = requests.post(url=url, json=data)
	if response.status_code != 200:
		players1.is_playing = False
		players1.save()
		players2.is_playing = False
		players2.save()
		return Response({"message": doc.MSG_ERROR_MATCH}, status=500)
	data = response.json().get('data')
	data[0]["bot_level"] = "1" if is_player2_bot else "-1"
	return Response({"message": doc.MSG_CREATE_MATCH, 'data': data}, status=201)

def start_match(tournament):
	match_id = tournament.next_match
	if match_id > tournament.max_match:
		dispatch_player(tournament)
		return Response({"message": doc.MSG_ROUND_FINISH,
				'data': {"round": "finish"}}, status=200)
	players = list(tournament.participant_set.filter(match=match_id, is_eliminated=False))
	if len(players) == 1:
		if match_id == tournament.max_match:
			dispatch_player(tournament)
			return Response({"message": doc.MSG_ROUND_FINISH,
					'data': {"round": "finish"}}, status=200)
		else:
			tournament.next_match += 1
			tournament.save()
			return start_match(tournament)
	if players[0].is_playing or players[1].is_playing:
		return Response({"message": doc.MSG_ERROR_PLAYER}, status=400)
	if players[0].type == Participant.UserType.BOT and players[1].type == Participant.UserType.BOT:
		winner = random.randint(0,1)
		if winner == 0:
			players[1].is_eliminated = True
			players[1].save()
		else:
			players[0].is_eliminated = True
			players[0].save()
		tournament.next_match += 1
		tournament.save()
		return start_match(tournament)
	return create_match(tournament, players)

@swagger_auto_schema(method='post',
	manual_parameters=[doc.JWT_TOKEN],
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['tournament_id'],
		properties={
			'tournament_id': openapi.Schema(type=openapi.TYPE_STRING)
		}
	),
	responses={
		200: doc.DOC_ROUND_FINISH,
		201: doc.DOC_START_MATCH,
		'400(0)': doc.DOC_ERROR_IS_PLAYING,
		'400(1)': doc.DOC_ERROR_TRN_ID,
		401: doc.DOC_ERROR_UNAUTHORIZED,
		405: doc.DOC_ERROR_METHOD_NOT_ALLOWED,
		500: doc.DOC_ERROR_START_MATCH
	})
@api_view(['POST'])
@permission_classes([IsNormalToken])
def start_match_view(request):
	tournament = get_tournament_id(request, False, Tournament.GameStatus.STARTED)
	if isinstance(tournament, Response):
		return tournament
	return start_match(tournament)


@swagger_auto_schema(method='post',
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['tournament_id', 'score1', 'score2'],
		properties={
			'tournament_id': openapi.Schema(type=openapi.TYPE_STRING),
			'score1': openapi.Schema(type=openapi.TYPE_STRING),
			'score2': openapi.Schema(type=openapi.TYPE_STRING)
		}
	),
	responses={
		200: doc.DOC_MATCH_TIE,
		'400(0)': doc.DOC_ERROR_SCORE,
		'400(1)': doc.DOC_ERROR_TRN_ID,
		405: doc.DOC_ERROR_METHOD_NOT_ALLOWED
	})
@api_view(['POST'])
def match_finished(request):
	score1 = request.data.get('score1', None)
	score2 = request.data.get('score2', None)
	if score1 is None or score2 is None:
		return Response({"message": doc.MSG_ERROR_SCORE_REQUIRED}, status=400)
	tournament = get_tournament_id(request, False, Tournament.GameStatus.STARTED)
	if isinstance(tournament, Response):
		return tournament
	players = list(tournament.participant_set.filter(match=tournament.next_match, is_eliminated=False))
	if len(players) != 2:
		return Response({"message": doc.MSG_ERROR_NO_PLAYER_FOUND}, status=400)
	if not players[0].is_playing or not players[1].is_playing:
		return Response({"message": doc.MSG_ERROR_PLAYER_NOT_PLAYING}, status=400)
	if score1 == score2:
		return Response({'message': doc.MSG_MATCH_TIE}, status=200)
	winner = 1 if score1 > score2 else 2
	if players[0].position != winner:
		players[0].is_eliminated = True
	else:
		players[1].is_eliminated = True
	players[0].is_playing = False
	players[1].is_playing = False
	players[0].save()
	players[1].save()
	tournament.next_match += 1
	tournament.save()
	return Response({'message': doc.MSG_MATCH_FINISH}, status=200)

@swagger_auto_schema(method='get',
	manual_parameters=[doc.TOURNAMENT, doc.HOST],
	responses={
		200: doc.DOC_PLAYER_HOST,
		'400(0)': doc.DOC_ERROR_HOST_REQUIRED,
		'400(1)': doc.DOC_ERROR_TRN_ID,
		405: doc.DOC_ERROR_METHOD_NOT_ALLOWED
	})
@api_view(['GET'])
def check_host_tournament(request):
	host_id = request.query_params.get('host_id', None)
	if host_id is None:
		return Response({"message": doc.MSG_ERROR_REQUIRED}, status=400)
	tournament = get_tournament_id(request, True, Tournament.GameStatus.STARTED)
	if isinstance(tournament, Response):
		return tournament
	if tournament.host != host_id:
		return Response({"message": doc.MSG_PLAYER_NOT_HOST,
					"data": {"is_host": False}}, status=200)
	return Response({"message": doc.MSG_PLAYER_HOST,
					"data": {"is_host": True}}, status=200)