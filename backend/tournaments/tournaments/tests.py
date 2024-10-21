from django.test import TestCase
from .utils import matchmaking
from .models import Tournament

class MachmakingTestCase(TestCase):
	def test_match(self):
		Tournament.objects.get(id=7)
		matchmaking()