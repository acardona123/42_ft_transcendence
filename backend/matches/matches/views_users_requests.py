from django.http import JsonResponse

from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import requests

def get_authenticated_user_id(request):
	# url = f"{settings.USERS_MICROSERVICE_URL}/api/users/???"
	# response = requests.get(url)
	# status = response.status_code
	# data_content = response.json()
	status = 200
	data_content={'message': 'player successfully identified', 'is_logged': True, 'user_id': 7}
	return {'status': status, 'data': data_content}


def get_new_ai_request():
	# url = f"{settings.USERS_MICROSERVICE_URL}/api/users/new/ai"
	# response = requests.get(url)
	# return response
	# status = response.status_code
	# data_content = response.json()
	status = 200
	data_content = {'message': 'new ia generated', 'ai_id': 8}
	return {'status': status, 'data': data_content}

def get_new_guest_request():
	# url = f"{settings.USERS_MICROSERVICE_URL}/api/users/new/guest"
	# response = requests.get(url)
	# return response
	# status = response.status_code
	# data_content = response.json()
	status = 200
	data_content = {'message': 'new_guest generated', 'guest_id': 9}
	return {'status': status, 'data': data_content}

def check_player_pin_ok(player_username, player_hashed_pin):
	# url = f"{settings.USERS_MICROSERVICE_URL}/api/users/???"
	# data = {'pin': player_hashed_pin}
	# response = requests.post(url, data)
	# status = response.status_code
	# data_content = response.json()
	status = 200
	data_content = {'message': 'player pin validated', 'data': {'valid': True, 'user_id': 12}}
	return {'status': status, 'data': data_content}