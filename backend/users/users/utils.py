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

# --------------- Oauth --------------------

def get_token_oauth(code):
	data = {
		'grant_type' : 'authorization_code',
		'client_id' : os.getenv('CLIENT_ID'),
		'client_secret' : os.getenv('CLIENT_SECRET'),
		'code' : code,
		'redirect_uri' : os.getenv('OAUTH_REDIRECT_URL'),
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
	user = CustomUser.objects.filter(oauth_id=id).first()
	user.set_status_online()
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

def get_refresh_token(token):
	refresh = RefreshToken(token)
	user = CustomUser.objects.filter(id=refresh.get('user_id')).first()
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

	img = qr.make_image(fill_color="black", back_color="white", image_factory=StyledPilImage, module_drawer=CircleModuleDrawer(), color_mask=RadialGradiantColorMask(), embeded_image_path="image.png")#todo change image for qrcode
	buffer = io.BytesIO()
	img.save(buffer, "PNG")
	buffer.seek(0)
	img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
	return img_base64

from datetime import timedelta
from app.settings import TIME_TIMEOUT

def get_online_status(user):
	if not user.is_online:
		return "offline"
	elif (timezone.now() - user.last_activity) > TIME_TIMEOUT:
		return "inactif"
	else:
		return "online"