from django.http import JsonResponse

from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import requests

def get_authenticated_user_id(request):
	# url = f"{settings.USERS_MICROSERVICE_URL}/api/users/is_logged_in"
	# response = requests.get(url)
	# data = response.json()
	data={'status': 200, 'message': 'player successfully identified', 'is_logged': True, 'user_id': 7}
	return data

def get_authenticated_user_id_or_new_guest(request):
	# url = f"{settings.USERS_MICROSERVICE_URL}/api/users/my_id"
	# # header=??? fot authentification
	# response = requests.get(url)
	# data = response.json()
	data = {'status': 200, 'message': 'player successfully identified or created', 'was_logged': 'True', 'user_id': 7}
	return data

def get_new_ai_request():
	# url = f"{settings.USERS_MICROSERVICE_URL}/api/users/new/ai"
	# response = requests.get(url)
	# return response
	# data = response.json()
	data = {'status': 200, 'message': 'new ia generated', 'ai_id': 8}
	return data

def get_new_guest_request():
	# url = f"{settings.USERS_MICROSERVICE_URL}/api/users/new/guest"
	# response = requests.get(url)
	# return response
	# data = response.json()
	data = {'status': 200, 'message': 'new_guest generated', 'guest_id': 9}
	return data

def check_player_pin_ok(player_id, player_hashed_pin):
	# url = f"{settings.USERS_MICROSERVICE_URL}/api/users/{player_id}/check_pin"
	# data = {'pin': player_hashed_pin}
	# response = requests.post(url, data)
	# data = response.json()
	data = {'status': 200, 'message': 'player pin validated', 'valid': True}
	return data