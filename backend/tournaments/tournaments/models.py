from django.db import models
from django.utils.translation import gettext_lazy as _

class Tournament(models.Model):
	class GameType(models.TextChoices):
		FLAPPY_BIRD = "FB", _("Flappy Bird")
		PONG = "PG", _("Pong")
		__empty__ = _("(Unknown)")
	
	class GameStatus(models.TextChoices):
		CREATION = "CR", _("Creation")
		ADD_USER = "AD", _("Add User")
		STARTED = "ST", _("Started")
		FINISHED = "FN", _("Finished")

	host = models.IntegerField('user id, not the participant id')
	game = models.CharField(max_length=2, choices=GameType, null=True)
	max_score = models.IntegerField(null=True)
	max_duration = models.IntegerField(null=True)
	status = models.CharField(max_length=2, choices=GameStatus, default=GameStatus.CREATION)
	max_match = models.IntegerField(null=True)
	next_match = models.IntegerField(null=True)

class Participant(models.Model):
	class UserType(models.TextChoices):
		GUEST = "GST", _("Guest")
		BOT = "BOT", _("Bot")
		USER = "USR", _("User")

	user = models.IntegerField()
	type = models.CharField(max_length=3, choices=UserType.choices, default=UserType.USER)
	is_playing = models.BooleanField(default=False)
	position = models.IntegerField(null=True)
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
	match = models.IntegerField(null=True)
	is_eliminated = models.BooleanField(default=False)