from rest_framework.response import Response
from .models import CustomUser
from .serializer import OauthUserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.tokens import AccessToken
from app.settings import TEMPORARY_ACCESS_TOKEN_LIFETIME
from .doc import MSG_USER_OAUTH_CREATED, MSG_ERROR_CREATING_USER_OAUTH, MSG_LOGIN_OAUTH
import certifi
import requests
import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers.pil import CircleModuleDrawer
from qrcode.image.styles.colormasks import RadialGradiantColorMask
import base64
import io
import os
from django.utils import timezone
from vault.hvac_vault import get_vault_kv_variable

# --------------- Oauth --------------------

def get_token_oauth(code):
	data = {
		'grant_type' : 'authorization_code',
		'client_id' : get_vault_kv_variable('oauth-id'),
		'client_secret' : get_vault_kv_variable('oauth-secret'),
		'code' : code,
		'redirect_uri' : os.getenv('OAUTH_REDIRECT_URL'),
		'state' : get_vault_kv_variable('oauth-state'),
	}
	response = requests.post('https://api.intra.42.fr/oauth/token', data=data, verify=certifi.where())
	if response.status_code != 200:
		return True, None
	return False, response.json().get('access_token')

def get_user_oauth(token):
	header = {'Authorization' : f'Bearer {token}'}
	return requests.get('https://api.intra.42.fr/v2/me', headers=header, verify=certifi.where())

def create_user_oauth(data):
	serializer = OauthUserSerializer(data=data)
	if serializer.is_valid():
		user = serializer.save()
		tokens = get_tokens_for_user(user)
		if '#' in serializer.data['username']:
			return Response({'message': MSG_USER_OAUTH_CREATED,
						'warning' : 'change username because already used',
						'data': {'user': serializer.data, 'tokens': tokens}}, status=201)
		else:
			return Response({'message': MSG_USER_OAUTH_CREATED,
						'data': {'user': serializer.data, 'tokens': tokens}}, status=201)
	return Response({'message': MSG_ERROR_CREATING_USER_OAUTH,
				'data': serializer.errors}, status=400)

def login_user_oauth(id):
	user = CustomUser.objects.get(oauth_id=id)
	user.set_status_online()
	tokens = get_tokens_for_user(user)
	return Response({'message': MSG_LOGIN_OAUTH,
						'data': {'tokens': tokens}}, status=200)

# --------------- JWT --------------------

class TemporaryToken(AccessToken):
	lifetime = TEMPORARY_ACCESS_TOKEN_LIFETIME

def get_temp_tokens_for_user(user):
	access_token = TemporaryToken.for_user(user)
	access_token["scope"] = "temporary"
	access_token["username"] = user.username
	return {
		'access': str(access_token),
	}

def get_tokens_for_user(user):
	refresh = RefreshToken.for_user(user)
	refresh["scope"] = "normal"
	refresh["username"] = user.username
	return {
		'refresh': str(refresh),
		'access': str(refresh.access_token),
	}

def get_refresh_token(token):
	refresh = RefreshToken(token)
	user = CustomUser.objects.get(id=refresh.get('user_id'))
	user.set_last_acticity()
	return {
		'refresh': str(refresh),
		'access': str(refresh.access_token),
	}

# --------------- 2fa --------------------

def generate_qr_code(data):
	qr = qrcode.QRCode(
		version=1,
		error_correction=qrcode.constants.ERROR_CORRECT_H,
		box_size=10,
		border=4,
	)
	qr.add_data(data)
	qr.make(fit=True)

	img = qr.make_image(fill_color="black", back_color="white", image_factory=StyledPilImage, module_drawer=CircleModuleDrawer(), color_mask=RadialGradiantColorMask(), embeded_image_path="qrcode_star.png")
	buffer = io.BytesIO()
	img.save(buffer, "PNG")
	buffer.seek(0)
	img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
	return img_base64

# ------------------Random word--------------
from string import capwords
from vault.hvac_vault import get_vault_kv_variable

def get_random_word():
	api_url = 'https://api.api-ninjas.com/v1/randomword'+'?type=noun'
	api_key = get_vault_kv_variable('api-key')
	response = requests.get(api_url, headers={'X-Api-Key': api_key}, verify=certifi.where())
	if response.status_code == requests.codes.ok:
		word = response.json().get('word', None)
		if word != None:
			word = word[0]
			word = capwords(word)
			word.replace(" ", "_")
		return word
	else:
		return None