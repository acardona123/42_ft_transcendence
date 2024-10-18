from rest_framework.decorators import api_view, permission_classes
from .authentication import IsNormalToken
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Tournament
from django.conf import settings
from .serializer import TournamentSerializer
from .utils import dispatch_player
import requests

def check_tournament(tournament_id, host_id, status):
	tournament = Tournament.objects.get(id=tournament_id)
	if tournament.host != host_id:
		raise
	if tournament.status != status:
		raise
	return tournament

@api_view(['POST'])
@permission_classes([IsNormalToken])
def create_tournament(request):
	try:
		tournament = Tournament.objects.create(host=request.user.id)
		tournament.participant_set.create(user=request.user.id)
		return Response({"message": "Tournament created, host added to the tournament",
						"data": {"tournament_id": tournament.id}}, status=200)
	except:
		return Response({"message": "Fail to create tournament"}, status=500)

class ManagePlayer(APIView):
	permission_classes = [IsNormalToken]

	def post(self, request):
		username = request.data.get("username", None)
		pin = request.data.get("pin", None)
		tournament_id = request.data.get("tournament_id", None)
		if not username or not pin:
			return Response({"message": "The fields 'username' and 'pin' are required"},
						status=400)
		if not tournament_id:
			return Response({"message": "The field 'tournament_id' is required"},
						status=400)
		try:
			tournament = check_tournament(tournament_id, request.user.id, Tournament.GameStatus.CREATION)
		except:
			return Response({"message": "Invalid tournament id"}, status=400)
		url = settings.USERS_MICROSERVICE_URL + "/api/private/users/login/pin/"
		response = requests.post(url=url, data={"username":username, "pin":pin})
		response_json = response.json()
		if response.status_code != 200 or response_json['data'].get('valid') == False:
			return Response({"message": "Incorrect username or pin"}, status=401)
		user_id = response_json['data'].get('user_id')
		if tournament.participant_set.filter(user=user_id).exists():
			player = tournament.participant_set.get(user=user_id)
			return Response({'message': 'Player already in the tournament',
					"data": {"username":username, "player_id": player.id}}, status=200)
		try:
			participant = tournament.participant_set.create(user=user_id)
			return Response({"message": "Player added to the tournament",
							"data": {"username": username, "player_id": participant.id}}, status=201)
		except:
			return Response({"message": "Failed to add the player to the tournament"},
						status=500)

	def delete(self, request):
		tournament_id = request.query_params.get('tournament_id', None)
		player_id = request.query_params.get('player_id', None)
		if not tournament_id or not player_id:
			return Response({"message": "The field 'tournament_id' and 'player_id' are required"}, status=400)
		try:
			tournament = check_tournament(tournament_id, request.user.id, Tournament.GameStatus.CREATION)
		except:
			return Response({"message": "Invalid tournament id"}, status=400)
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
	tournament_id = request.data.get("tournament_id", None)
	if not tournament_id:
		return Response({"message": "The field 'tournament_id' is required"},
					status=400)
	try:
		tournament = check_tournament(tournament_id, request.user.id, Tournament.GameStatus.CREATION)
	except:
		return Response({"message": "Invalid tournament id"}, status=400)
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
	tournament_id = request.query_params.get('tournament_id', None)
	if not tournament_id:
		return Response({"message": "The field 'tournament_id' is required"}, status=400)
	try:
		tournament = check_tournament(tournament_id, request.user.id, Tournament.GameStatus.STARTED)
	except:
		return Response({"message": "Invalid tournament id"}, status=400)
	url = settings.USERS_MICROSERVICE_URL+"/api/private/users/retrieve/type/"
	players = list(tournament.participant_set.all())
	players_id = [player.user for player in players]
	response = requests.post(url=url, json={'users_id':players_id})
	if response.status_code != 200:
		return Response({"message": "Error while retrieving user type"}, status=400)
	data = response.json().get('data')
	players_id = [player_id for player_id in players_id if data.get(str(player_id)) == 'GST']
	url = settings.USERS_MICROSERVICE_URL+"/api/private/users/retrieve/usernames/"
	response = requests.post(url=url, json={"users_id": players_id})
	if response.status_code != 200:
		return Response({"message": "Error while retrieving username"}, status=400)
	data = response.json().get('data')
	username = [data.get(str(player_id)) for player_id in players_id]
	return Response({'message': 'Guests username', 'data': username}, status=200)

@api_view(['GET'])
@permission_classes([IsNormalToken])
def get_match_for_round(request):
	tournament_id = request.query_params.get('tournament_id', None)
	if not tournament_id:
		return Response({"message": "The field 'tournament_id' is required"}, status=400)
	try:
		tournament = check_tournament(tournament_id, request.user.id, Tournament.GameStatus.STARTED)
	except:
		return Response({"message": "Invalid tournament id"}, status=400)
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

@api_view(['POST'])
@permission_classes([IsNormalToken])
def start_match(request):
	tournament_id = request.data.get('tournament_id', None)
	if not tournament_id:
		return Response({"message": "The field 'tournament_id' is required"}, status=400)
	try:
		tournament = check_tournament(tournament_id, request.user.id, Tournament.GameStatus.STARTED)
	except:
		return Response({"message": "Invalid tournament id"}, status=400)
	match_id = tournament.next_match
	if match_id > tournament.max_match:
		dispatch_player(tournament)
		return Response({"message": "Round finished",
				'data': {"round": "finish"}}, status=200)
	players = list(tournament.participant_set.filter(match=match_id, is_eliminated=False))
	if len(players) == 1:
		if match_id == tournament.max_match:
			dispatch_player(tournament)
			return Response({"message": "Last player pass to the next round, round finished",
					'data': {"round": "finish"}}, status=200)
		else:
			tournament.next_match += 1
			tournament.save()
			return Response({"message": "Player is alone for the match, he wins by default"}, status=200)
	if players[0].is_playing or players[1].is_playing:
		return Response({"message": "Players are already playing"}, status=400)
	players[0].is_playing = True
	players[0].position = 1
	players[0].save()
	players[1].is_playing = True
	players[1].position = 2
	players[1].save()
	url = settings.MATCHES_MICROSERVICE_URL+"/private_api/matches/new_match_verified_id/"
	data = {"player1": players[0].user,
			"player2": players[1].user,
			"game": tournament.game,
			"max_score": tournament.max_score,
			"max_duration": tournament.max_duration,
			"tournament_id": tournament.id}
	response = requests.post(url=url, json=data)
	if response.status_code != 200:
		players[0].is_playing = False
		players[0].save()
		players[1].is_playing = False
		players[1].save()
		return Response({"message": "Error while creating match"}, status=500)
	data = response.json().get('data')
	return Response({"message": "Match created", 'data': data}, status=201)

@api_view(['POST'])
@permission_classes([IsNormalToken])
def match_finished(request):
	tournament_id = request.data.get('tournament_id', None)
	score1 = request.data.get('score1', None)
	score2 = request.data.get('score2', None)
	if not tournament_id:
		return Response({"message": "The field 'tournament_id' is required"}, status=400)
	try:
		tournament = check_tournament(tournament_id, request.user.id, Tournament.GameStatus.STARTED)
	except:
		return Response({"message": "Invalid tournament id"}, status=400)
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