from django.core.exceptions import BadRequest
from rest_framework.response import Response
from .models import CustomUser
from .serializer import OauthUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import certifi
import requests
import os

def get_token_oauth(code):
	data = {
		'grant_type' : 'authorization_code',
		'client_id' : os.getenv('CLIENT_ID'),
		'client_secret' : os.getenv('CLIENT_SECRET'),
		'code' : code,
		'redirect_uri' : os.getenv('REDIRECT_URL'),
		'state' : os.getenv('STATE'),
	}
	response = requests.post('https://api.intra.42.fr/oauth/token', data=data, verify=certifi.where())
	if response.status_code != 200:
		raise BadRequest
	return response.json()['access_token']

def get_user_oauth(token):
	header = {'Authorization' : f'Bearer {token}'}
	return requests.get('https://api.intra.42.fr/v2/me', headers=header, verify=certifi.where())

def create_user_oauth(data):
	change_username = False
	if data.get('login', None) is not None and CustomUser.objects.filter(username=data['login']).exists():
		data['login'] = data['login']+'😂' #todo choose random username valid
		change_username = True
	serializer = OauthUserSerializer(data=data)
	if serializer.is_valid():
		user = serializer.save()
		print(user)
		print(type(user))
		tokens = get_tokens_for_user(user)
		if change_username:
			return Response({'message': 'new user created with 42 API',
						'warning' : 'change username because already used',
						'data': {'user': serializer.data, 'tokens': tokens}}, status=201)
		else:
			return Response({'message': 'new user created with 42 API',
						'data': {'user': serializer.data, 'tokens': tokens}}, status=201)
	return Response({'message': 'invalid data to create new user with 42 API',
				'data': serializer.errors}, status=400)

def get_tokens_for_user(user):
	refresh = RefreshToken.for_user(user)
	print(refresh.payload)
	print(refresh.access_token.payload)

	return {
		'refresh': str(refresh),
		'access': str(refresh.access_token),
	}