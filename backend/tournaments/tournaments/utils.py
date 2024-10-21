import random
from .models import Tournament

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

import math

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
	tournament.max_match = max(new_match)
	if tournament.max_match == 1 and len(players) == 1:
		tournament.status = Tournament.GameStatus.FINISHED
	tournament.save()