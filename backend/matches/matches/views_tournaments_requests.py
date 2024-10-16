from django.http import JsonResponse

from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import requests

def is_host_of_tournament(tournament_id, user_id):
	# url = f"{settings.TOURNAMENT_MICROSERVICE_URL}/private_api/is_host/{tournament_id}/{user_id}"
	# response = requests.get(url)
	# status = response.status_code
	# data_content = response.json()
	status = 200
	body_content = {'message': 'tournament host check done', 'data': {'is_host': True}}
	return {'status': status, 'body': body_content}