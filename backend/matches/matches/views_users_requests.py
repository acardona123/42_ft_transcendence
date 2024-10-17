from django.http import JsonResponse

from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import requests

from django.conf import settings

def get_new_ai_request():
	url = f"{settings.USERS_MICROSERVICE_URL}/api/private/users/new/player/ai/"
	response = requests.post(url, json={})
	status = response.status_code
	body_content = response.json()
	return {'status': status, 'body': body_content}

def get_new_guest_request():
	url = f"{settings.USERS_MICROSERVICE_URL}/api/private/users/new/player/guest/"
	response = requests.post(url, json={})
	status = response.status_code
	body_content = response.json()
	print("content: ===============================")
	print (body_content) #///////////////////////////////////////
	return {'status': status, 'body': body_content}

def check_player_pin_ok(player_username, player_pin):
	url = f"{settings.USERS_MICROSERVICE_URL}/api/private/users/login/pin/"
	body = {'username': player_username, 'pin': player_pin}
	response = requests.post(url, json = body)
	status = response.status_code
	body_content = response.json()
	return {'status': status, 'body': body_content}
