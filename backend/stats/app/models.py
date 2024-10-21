from django.db import models

class statistics(models.Model):
	user_id = models.IntegerField
	total_matches_flappy = models.IntegerField
	total_matches_pong = models.IntegerField
	total_victory_flappy = models.IntegerField
	total_victory_pong = models.IntegerField

	def __str__(self):
		return f"Number of victory flappy and pong ({self.total_victory_flappy}, {self.total_victory_pong}), and total matches played ({self.total_matches_flappy}, {self.total_matches_pong})"