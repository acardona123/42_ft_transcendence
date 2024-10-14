from django.db import models

class Friendship(models.Model):
	user1 = models.IntegerField()
	user2 = models.IntegerField()

	class Meta:
		unique_together = ('user1', 'user2')

	def __str__(self):
		return f"Friendship between User {self.user1} and User {self.user2}"


class FriendRequest(models.Model):
	sender = models.IntegerField()
	receiver = models.IntegerField()
	date = models.DateTimeField(auto_now_add=True, null=False, blank=False)

	class Meta:
		unique_together = ('sender', 'receiver')

	def __str__(self):
		return f"Friend request send by {self.sender} to {self.receiver}"