from django.db import models
from .views_users_requests import get_usernames_request

GAME = {
	"FB": "Flappy Fish",
	"PG": "Pong"
}

class Match(models.Model):
	user1 = models.IntegerField("user 1 id")
	user2 = models.IntegerField("user 2 id")
	game = models.CharField(max_length=2, choices=GAME)
	max_score = models.IntegerField("game's match maximum points amount per player")
	max_duration = models.IntegerField("game's match maximum duration in seconds")
	date = models.DateTimeField(auto_now_add=True)
	score1 = models.PositiveIntegerField("score of the player 1", blank=True, null=True)
	score2 = models.PositiveIntegerField("score of the player 2", blank=True, null=True)
	duration = models.PositiveIntegerField("match duration in seconds", blank=True, null=True)
	is_finished = models.BooleanField("flag raised when the match ends", default=False)
	tournament_id = models.IntegerField("tournament_id, set to -1 if the match is not in a tournament", default=-1)


	class Meta:
		ordering = ["-date", "game"]

	def __str__(self):
		usernames_request = get_usernames_request([self.user1, self.user2])
		if usernames_request.get("status") != 200:
			return f"Match between User with id {self.user1} and User with id {self.user2}"
		else :
			players = usernames_request.get("body").get("data")
			return f"Match between {players.get(str(self.user1))} and {players.get(str(self.user2))}"
			
	
	# def get_absolute_url(self):
		# ... ?
