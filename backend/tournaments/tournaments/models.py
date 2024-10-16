from django.db import models
from django.utils.translation import gettext_lazy as _

class Tournament(models.Model):
	class GameType(models.TextChoices):
		FLAPPY_BIRD = "FB", _("Flappy Bird")
		PONG = "PG", _("Pong")
		__empty__ = _("(Unknown)")
	
	class GameStatus(models.TextChoices):
		CREATION = "CR", _("Creation")
		STARTED = "ST", _("Started")
		FINISHED = "FN", _("Finished")

	host = models.IntegerField()
	game = models.CharField(max_length=2, choices=GameType, null=True)
	max_score = models.IntegerField(null=True)
	max_duration = models.IntegerField(null=True)
	status = models.CharField(max_length=2, choices=GameStatus, default=GameStatus.CREATION)
	max_round = models.IntegerField(null=True)
	round_played = models.IntegerField(null=True)

class Participant(models.Model):
	user = models.IntegerField()
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
	round = models.IntegerField(null=True)
	is_eliminated = models.BooleanField(default=False)

