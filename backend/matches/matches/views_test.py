from django.http import JsonResponse

from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes
from datetime import timedelta
from django.utils import timezone

from matches.models import Match
from matches.serializer import MatchSerializer

from django.conf import settings

import requests
from django.core.exceptions import BadRequest
from django.http import HttpResponse

# @api_view(['GET'])
def test_hello(request):
	return HttpResponse("Hello world!")


import random

def test_create_matches(request):
	num_matches = 10
	matches = []
	for i in range(num_matches):
		user1 = random.randint(1, 10)
		user2 = random.randint(1, 10)
		
		while user2 == user1:
			user2 = random.randint(1, 10)
		
		match = Match(
			user1=user1,
			user2=user2,
			game=random.choice(['FB', 'PG']),
			max_score=21,
			max_duration=300,
			score1=random.randint(0, 21),
			score2=random.randint(0, 21),
			duration=random.randint(100, 300),
			is_finished=False,
			tournament_id=random.randint(-1, 2),
			date=timezone.now() - timedelta(days=random.randint(0, 30))
		)
		matches.append(match)
	Match.objects.bulk_create(matches)
	try:
		serializer = MatchSerializer(matches, many=True, fields = ['user1', 'user2', 'game'])
		data = serializer.data
	except:
		data = {}
		data.status_text = "10 Matches created!"
	return JsonResponse(data, safe=False)

def test_delete_all_matches(request):
	Match.objects.all().delete()
	return HttpResponse("All matches deleted")

def test_finish_all_matches(request):
	Match.objects.all().update(is_finished=True)
	return HttpResponse("All matches finished")