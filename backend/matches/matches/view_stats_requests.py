from django.http import JsonResponse

from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Match
import requests


def post_match_finished_stats(user1, user2, game, winner):
	url = "http://stats:8006/api/private/stats/post_match_data/"
	body = {
		"player_id1": user1,
		"player_id2": user2,
		"game": game,
		"winner": winner
	}
	response = requests.post(url, json = body)
	status = response.status_code
	body_content = response.json()
	return {'status': status, 'body': body_content}