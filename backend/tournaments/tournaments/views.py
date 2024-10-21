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

def get_tournament_id(request, query_string, status):
	if query_string:
		tournament_id = request.query_params.get('tournament_id', None)
	else:
		tournament_id = request.data.get('tournament_id', None)
	if not tournament_id:
		return Response({"message": "The field 'tournament_id' is required"},
					status=400)
	try:
		tournament = Tournament.objects.get(id=tournament_id)
		if tournament.host != request.user.id:
			raise
		if tournament.status != status:
			raise
		return tournament
	except:
		return Response({"message": "Invalid tournament id"}, status=400)

@api_view(['POST'])
@permission_classes([IsNormalToken])
def create_tournament(request):
	try:
		tournament = Tournament.objects.create(host=request.user.id)
		tournament.participant_set.create(user=request.user.id, type=Participant.UserType.USER)
		return Response({"message": "Tournament created, host added to the tournament",
						"data": {"tournament_id": tournament.id}}, status=200)
	except:
		return Response({"message": "Fail to create tournament"}, status=500)

def add_participant(tournament, user_id, username):
	if tournament.participant_set.filter(user=user_id).exists():
		player = tournament.participant_set.get(user=user_id)
		return Response({'message': 'Player already in the tournament',
				"data": {"username":username, "player_id": player.id}}, status=200)
	try:
		participant = tournament.participant_set.create(user=user_id, type=Participant.UserType.USER)
		return Response({"message": "Player added to the tournament",
						"data": {"username": username, "player_id": participant.id}}, status=201)
	except:
		return Response({"message": "Failed to add the player to the tournament"},
					status=500)
	
class ManagePlayer(APIView):
	permission_classes = [IsNormalToken]

	def post(self, request):
		username = request.data.get("username", None)
		pin = request.data.get("pin", None)
		if not username or not pin:
			return Response({"message": "The fields 'username' and 'pin' are required"},
						status=400)
		tournament = get_tournament_id(request, False, Tournament.GameStatus.CREATION)
		if isinstance(tournament, Response):
			return tournament
		url = settings.USERS_MICROSERVICE_URL + "/api/private/users/login/pin/"
		response = requests.post(url=url, data={"username":username, "pin":pin})
		response_json = response.json()
		if response.status_code != 200 or response_json['data'].get('valid') == False:
			return Response({"message": "Incorrect username or pin"}, status=401)
		user_id = response_json['data'].get('user_id')
		return add_participant(tournament, user_id, username)

	def delete(self, request):
		player_id = request.query_params.get('player_id', None)
		tournament = get_tournament_id(request, True, Tournament.GameStatus.CREATION)
		if isinstance(tournament, Response):
			return tournament
		if tournament.participant_set.filter(id=player_id).exists() == False:
			return Response({"message": "Invalid player id"}, status=400)
		player = tournament.participant_set.get(id=player_id)
		if tournament.host == player.user:
			return Response({"message": "Impossible to remove host from the tournament"}, status=400)
		tournament.participant_set.filter(id=player_id).delete()
		return Response({"message": "Player removed from the tournament",
						"data": {"player_id": player_id}}, status=200)

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
		return Response({"message": "Tournament info validated"}, status=200)
	else:
		return Response({"message": "Error while updating tournaments settings",
				"data": serializer.errors}, status=400)

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
		return Response({"message": "Error while retrieving username"}, status=400)
	data = response.json().get('data')
	username = [data.get(str(guest_id)) for guest_id in guests_id]
	return Response({'message': 'Guests username', 'data': username}, status=200)

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
		return Response({"message": "Error while retrieving username"}, status=400)
	data = response.json().get('data')
	matches = []
	for match in range(1, tournament.max_match + 1):
		players = list(tournament.participant_set.filter(match=match, is_eliminated=False))
		matches.append([data.get(str(player.user)) for player in players])
	return Response({"message": "Matches in a round",
					'data': {'matches': matches}}, status=200)

def create_match(tournament, players):
	if players[0].type == Participant.UserType.BOT:
		players1 = players[1]
		players2 = players[0]
	else:
		players1 = players[0]
		players2 = players[1]

	players1.is_playing = True
	players1.position = 1
	players1.save()
	players2.is_playing = True
	players2.position = 2
	players2.save()
	url = settings.MATCHES_MICROSERVICE_URL+"/private_api/matches/new_match_verified_id/"
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
		return Response({"message": "Error while creating match"}, status=500)
	data = response.json().get('data')
	return Response({"message": "Match created", 'data': data}, status=201)

def start_match(tournament):
	match_id = tournament.next_match
	if match_id > tournament.max_match:
		dispatch_player(tournament)
		return Response({"message": "Round finished",
				'data': {"round": "finish"}}, status=200)
	players = list(tournament.participant_set.filter(match=match_id, is_eliminated=False))
	if len(players) == 1:
		if match_id == tournament.max_match:
			dispatch_player(tournament)
			return Response({"message": "Round finished",
					'data': {"round": "finish"}}, status=200)
		else:
			tournament.next_match += 1
			tournament.save()
			return start_match(tournament)
	if players[0].is_playing or players[1].is_playing:
		return Response({"message": "Players are already playing"}, status=400)
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

@api_view(['POST'])
@permission_classes([IsNormalToken])
def start_match_view(request):
	tournament = get_tournament_id(request, False, Tournament.GameStatus.STARTED)
	if isinstance(tournament, Response):
		return tournament
	return start_match(tournament)

@api_view(['POST'])
@permission_classes([IsNormalToken])
def match_finished(request):
	score1 = request.data.get('score1', None)
	score2 = request.data.get('score2', None)
	if not score1 or not score2:
		return Response({"message": "The fields 'score1' and 'score2' are required"}, status=400)
	tournament = get_tournament_id(request, False, Tournament.GameStatus.STARTED)
	if isinstance(tournament, Response):
		return tournament
	players = list(tournament.participant_set.filter(match=tournament.next_match, is_eliminated=False))
	if not players[0].is_playing or not players[1].is_playing:
		return Response({"message": "Players are not playing, match can't be finished"}, status=400)
	if score1 == score2:
		return Response({'message': "Match tie, need to be replayed"}, status=200)
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
	return Response({'message': "match finihed"}, status=200)