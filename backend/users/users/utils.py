from rest_framework.response import Response
from .models import CustomUser
from .serializer import OauthUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import AccessToken
from app.settings import TEMPORARY_ACCESS_TOKEN_LIFETIME
from .doc import MSG_USER_OAUTH_CREATED, MSG_ERROR_CREATING_USER_OAUTH, MSG_LOGIN_OAUTH
import certifi
import requests
import os

# --------------- Oauth --------------------

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
		return True, None
	return False, response.json()['access_token']

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
		tokens = get_tokens_for_user(user)
		if change_username:
			return Response({'message': MSG_USER_OAUTH_CREATED,
						'warning' : 'change username because already used',
						'data': {'user': serializer.data, 'tokens': tokens}}, status=201)
		else:
			return Response({'message': MSG_USER_OAUTH_CREATED,
						'data': {'user': serializer.data, 'tokens': tokens}}, status=201)
	return Response({'message': MSG_ERROR_CREATING_USER_OAUTH,
				'data': serializer.errors}, status=400)

def login_user_oauth(id):
	user = CustomUser.objects.filter(oauth_id=id).first()
	tokens = get_tokens_for_user(user)
	return Response({'message': MSG_LOGIN_OAUTH,
						'data': {'tokens': tokens}}, status=200)

# --------------- JWT --------------------

class TemporaryToken(AccessToken):
	lifetime = TEMPORARY_ACCESS_TOKEN_LIFETIME

def get_temp_tokens_for_user(user):
	acces_token = TemporaryToken.for_user(user)
	acces_token["scope"] = "temporary"
	return {
		'access': str(acces_token),
	}

def get_tokens_for_user(user):
	refresh = RefreshToken.for_user(user)
	refresh["scope"] = "normal"
	return {
		'refresh': str(refresh),
		'access': str(refresh.access_token),
	}

# --------------- 2fa --------------------
