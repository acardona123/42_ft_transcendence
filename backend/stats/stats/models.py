from django.db import models

class statistics(models.Model):
	id = models.IntegerField
	total_flappy_matches = models.IntegerField(default=0)
	total_pong_matches = models.IntegerField(default=0)
	total_flappy_victory = models.IntegerField(default=0)
	total_pong_victory = models.IntegerField(default=0)
	total_tournament_victory = models.IntegerField(default=0)
	total_tournament_played = models.IntegerField(default=0)

	def get_ratio_flappy(self):
		return (self.total_flappy_victory / self.total_flappy_matches)

	def get_ratio_pong(self):
		return (self.total_pong_victory / self.total_pong_matches)

	def __str__(self):
		return f"Number of victory flappy and pong ({self.total_flappy_victory}, {self.total_pong_victory}), and total matches played ({self.total_flappy_matches}, {self.total_pong_matches})"