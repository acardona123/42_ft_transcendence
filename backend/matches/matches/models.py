from django.db import models

class Game(models.Model):
	name = models.CharField(max_length = 20)

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
	is_finished = models.BooleanField(default = False)
	clean_when_finished = models.BooleanField(default = True)


	class Meta:
		ordering = ["-date", "game"]

	def __str__(self):
		return f"Match between User {self.user1} and User {self.user2}"
	
	# def get_absolute_url(self):
		# ...
