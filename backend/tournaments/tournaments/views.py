from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Tournament
from django.conf import USERS_MICROSERVICE_URL
from .serializer import TournamentSerializer
import requests

def check_tournament(tournament_id, host_id):
	tournament = Tournament.objects.get(id=tournament_id)
	if tournament.host != host_id:
		raise
	if tournament.status != Tournament.GameStatus.CREATION:
		raise
	return tournament

@api_view('POST')
def create_tournament(request):
	try:
		tournament = Tournament.objects.create(host=request.user.id)
		return Response({"message": "Tournament created",
						"data": {"tournament_id": tournament.id}}, status=200)
	except:
		return Response({"message": "Fail to create tournament"}, status=500)

class manage_player(APIView):
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
			tournament = check_tournament(tournament_id, request.user.id)
		except:
			return Response({"message": "Invalid tournament id"}, status=400)
		url = USERS_MICROSERVICE_URL + "/api/private/users/login/pin/"
		response = requests.post(url=url, data={"username":username, "pin":pin})
		response_json = response.json()
		if response.status_code != 200 or response_json['data'].get('valid') == False:
			return Response({"message": "Incorrect username or pin"}, status=401)
		user_id = response_json['data'].get('user_id')
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
			tournament = check_tournament(tournament_id, request.user.id)
		except:
			return Response({"message": "Invalid tournament id"}, status=400)
		if tournament.participant_set.filter(id=player_id).exists() == False:
			return Response({"message": "Invalid player id"}, status=400)
		tournament.participant_set.filter(id=player_id).delete()
		return Response({"message": "Player removed from the tournament",
						"data": {"player_id": player_id}}, status=200)

@api_view('POST')
def start_tournament(request):
	tournament_id = request.data.get("tournament_id", None)
	if not tournament_id:
		return Response({"message": "The field 'tournament_id' is required"},
					status=400)
	try:
		tournament = check_tournament(tournament_id, request.user.id)
	except:
		return Response({"message": "Invalid tournament id"}, status=400)
	nb_players = tournament.participant_set.all()
	serializer = TournamentSerializer(tournament, data=request.data,
							context={'nb_player': nb_players})
	if serializer.is_valid():
		serializer.save()
		#todo match macking for the first round
		return Response({"message": "Tournament info validated"}, status=200)
	else:
		return Response({"message": "Error while updating tournaments settings",
				"data": serializer.errors}, status=400)
	
