import random
from .models import Tournament
from rest_framework.response import Response
import requests
import math

def matchmaking(tournament):
	players = list(tournament.participant_set.all())
	random.shuffle(players)
	nb_match = 1
	player_by_match = 0
	for player in players:
		player_by_match+=1
		if player_by_match > 2:
			player_by_match = 1
			nb_match+=1
		player.match = nb_match
		player.save()
	tournament.max_match = nb_match
	tournament.next_match = 1

def dispatch_player(tournament):
	players = list(tournament.participant_set.filter(is_eliminated=False))
	if len(players) % 2 == 1:
		new_match = [player.match / 2.0 + 1 for player in players]
	else:
		new_match = [math.ceil(player.match / 2.0) for player in players]
	for i, player in enumerate(players):
		player.match = new_match[i]
		player.save()
	tournament.next_match = 1
	tournament.max_match = int(max(new_match))
	if tournament.max_match == 1 and len(players) == 1:
		return end_tournaments(tournament)
	tournament.save()

def end_tournaments(tournament):
	tournament.status = Tournament.GameStatus.FINISHED
	tournament.save()
	url="http://stats:8006/api/private/stats/post_tournament_data/"
	participant_id = [ participant.user for participant in list(tournament.participant_set.all())]
	data={"list_participants": participant_id,
		"winner": tournament.participant_set.get(is_eliminated=False).user,
		"game": tournament.game}
	response = requests.post(url=url, json=data)
	if response.status_code != 200:
		return Response({"message": "Error while updating stats at the end of the tournament"}, status=500)
	return None

