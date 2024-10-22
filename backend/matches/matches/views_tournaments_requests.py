from django.http import JsonResponse

from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import requests

from django.conf import settings

def get_is_host_of_tournament(tournament_id, user_id):
	url = f"{settings.TOURNAMENT_MICROSERVICE_URL}/api/private/tournaments/is_host/?host_id=${user_id}&tournament_id=${tournament_id}"
	response = requests.get(url)
	status = response.status_code
	body_content = response.json()
	return {'status': status, 'body': body_content}

def post_declare_match_finished(tournament_id, score_player_1, score_player_2):
	url =  f"{settings.TOURNAMENT_MICROSERVICE_URL}/private/tournaments/match/finish/"
	body = {
		"tournament_id": "tournament_id",
		"score1": score_player_1,
		"score2": score_player_2
	}
	response = requests.post(url, json = body)
	status = response.status_code
	body_content = response.json()
	return {'status': status, 'body': body_content}
