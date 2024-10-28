from django.db import models


class Statistics(models.Model):
	use_in_migrations = True

	player_id = models.IntegerField(null=True) #rajouter le unique peut etre
	total_flappy_matches = models.IntegerField(default=0)
	total_pong_matches = models.IntegerField(default=0)
	total_flappy_victory = models.IntegerField(default=0)
	total_pong_victory = models.IntegerField(default=0)
	total_flappy_tournament_victory = models.IntegerField(default=0)
	total_flappy_tournament_played = models.IntegerField(default=0)
	total_pong_tournament_victory = models.IntegerField(default=0)
	total_pong_tournament_played = models.IntegerField(default=0)

	def get_ratio_flappy(self):
		return (self.total_flappy_victory / self.total_flappy_matches)

	def get_ratio_pong(self):
		return (self.total_pong_victory / self.total_pong_matches)

	def __str__(self):
		return f"The id is {self.player_id}  Number of victory flappy and pong ({self.total_flappy_victory}, {self.total_pong_victory}), and total matches played ({self.total_flappy_matches}, {self.total_pong_matches}) and total tournament played flappy and pong ({self.total_flappy_tournament_played}, {self.total_pong_tournament_played}) and victory tournament ({self.total_flappy_tournament_victory}, {self.total_pong_tournament_victory}) "
	
class UpdateMatchStatistics(models.Model):
	player_id1 = models.IntegerField()
	player_id2 = models.IntegerField()
	game = models.CharField()
	winner = models.IntegerField()