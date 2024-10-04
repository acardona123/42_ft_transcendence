from rest_framework.decorators import api_view, permission_classes
from django_otp.plugins.otp_totp.models import TOTPDevice
from .authentication import IsTemporaryToken, IsNormalToken
from rest_framework.response import Response
from django.http import HttpResponse
from django.contrib.auth import authenticate
from .serializer import UserSerializer, UpdatePasswordSerializer, UpdateUserSerializer
from .utils import get_token_oauth, get_user_oauth, create_user_oauth, get_tokens_for_user, get_temp_tokens_for_user, login_user_oauth, generate_qr_code
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
import os
from .doc import (MSG_ERROR_CREATING_USER, MSG_ERROR_NO_ACCOUNT,
	MSG_ERROR_TOKEN_REQUIRED, MSG_ERROR_NO_TOTP_DEVICE, MSG_ERROR_WRONG_TOKEN,
	MSG_ERROR_WRONG_2FA_STATUS, MSG_ERROR_2FA_IS_DISABLE, MSG_ERROR_OAUTH_LOGIN,
	MSG_ERROR_OAUTH_INFO, MSG_ERROR_UPDATE_PASSWORD_OAUTH, MSG_ERROR_UPDATE_PASSWORD,
	MSG_ERROR_UPDATE_USER_INFO, MSG_USER_CREATED, MSG_LOGIN_NEED_2FA,
	MSG_LOGIN, MSG_DISABLE_2FA, MSG_ENABLE_2FA, MSG_SEND_URL_OAUTH,
	MSG_PASSWORD_UPDATE, MSG_INFO_USER_UPDATE,
	DOC_ERROR_METHOD_NOT_ALLOWED, DOC_USER_CREATED, DOC_ERROR_CREATING_USER,
	DOC_USER_LOGIN, DOC_USER_LOGIN_2FA, DOC_ERROR_LOGIN_FAILED,
	DOC_ERROR_UNAUTHORIZED, DOC_2FA_VALID, DOC_ERROR_INVALID_2FA,
	JWT_TOKEN, DOC_ERROR_WRONG_2FA_STATUS, DOC_DISABLE_2FA, DOC_ENABLE_2FA,
	DOC_URL_OAUTH42, DOC_USER_LOGIN_API42, DOC_USER_CREATED_API42_WARNING,
	DOC_USER_CREATED_API42, DOC_ERROR_LOGIN_API42, DOC_ERROR_UPDATE_PASSWORD,
	DOC_IMPOSSIBLE_UPDATE_PASSWORD, DOC_UPDATE_PASSWORD, DOC_ERROR_UPDATE_INFO,
	DOC_UPDATE_INFO)

# @api_view(['GET'])
# def get_id(request):
# 	body = request.body
# 	# json.loads(body).get('name')
# 	# check name in database
# 	dic = {"id" : "7"}
# 	return Response(dic)
# 	# return HttpResponse(status=status.HTTP_408_REQUEST_TIMEOUT)

# @api_view(['POST'])
# def get_usernames(request):
# 	body = request.body
# 	print(body)
# 	users = json.loads(body).get('users')
# 	print(users)
# 	#get username in the database
# 	list = ['johanne', 'quentin', 'arthur', 'alex', 'alexandre', 'jeanne', 'ulysse', 'user1', 'user2']
# 	dic = dict()
# 	i = 0
# 	for user in users:
# 		dic[user] = list[i]
# 		i+=1
# 	return Response(dic)
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
# --------------- user managment --------------------

@swagger_auto_schema(method='post',
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['username','password', 'password2'],
		properties={
			'username': openapi.Schema(type=openapi.TYPE_STRING),
			'password': openapi.Schema(type=openapi.TYPE_STRING),
			'password2': openapi.Schema(type=openapi.TYPE_STRING),
			'email': openapi.Schema(type=openapi.TYPE_STRING),
			'phone': openapi.Schema(type=openapi.TYPE_STRING),
		}
	),
	responses={
		201: DOC_USER_CREATED,
		400: DOC_ERROR_CREATING_USER,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
def register_user(request):
	serializer = UserSerializer(data=request.data)
	if serializer.is_valid():
		user = serializer.save()
		tokens = get_tokens_for_user(user)
		data = {
			"message" : MSG_USER_CREATED,
			"data" : {'user': serializer.data, 'tokens': tokens}
		}
		return Response(data, status=201)
	data = {
		"message" : MSG_ERROR_CREATING_USER,
		"data" : serializer.errors
	}
	return Response(data, status=400)

@swagger_auto_schema(method='post',
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['username','password'],
		properties={
			'username': openapi.Schema(type=openapi.TYPE_STRING),
			'password': openapi.Schema(type=openapi.TYPE_STRING),
		}
	),
	responses={
		200: DOC_USER_LOGIN,
		"200bis": DOC_USER_LOGIN_2FA,
		401: DOC_ERROR_LOGIN_FAILED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
def login_user(request):
	username = request.data.get('username', None)
	password = request.data.get('password', None)
	user = authenticate(username=username, password=password)
	if user is None:
		return Response({"message": MSG_ERROR_NO_ACCOUNT}, status=401)
	if user.is_2fa_enable:
		token = get_temp_tokens_for_user(user)
		token['2fa_status'] = user.is_2fa_enable
		return Response({"message": MSG_LOGIN_NEED_2FA,
					"data" : token}, status=200)
	user.is_online = True
	user.save()
	token = get_tokens_for_user(user)
	token["2fa_status"] = user.is_2fa_enable
	return Response({"message": MSG_LOGIN,
				  	"data" : token}, status=200)

@api_view(['POST'])
@permission_classes([IsNormalToken])
def logout(request):
	refresh = request.data.get('refresh', None)
	if refresh is None:
		return Response({"message": "Refresh field is required"}, 400)
	try:
		token = RefreshToken(refresh)
		token.blacklist()
	except:
		return Response({"message": "Invalid refresh token"}, 401)
	request.user.is_online = False
	request.user.save()
	return Response({"message": "Logout successful"}, 200)

# --------------- 2fa --------------------
@swagger_auto_schema(method='post',
	manual_parameters=[JWT_TOKEN],
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['token'],
		properties={
			'token': openapi.Schema(type=openapi.TYPE_STRING, description='6 digits'),
		}
	),
	responses={
		200: DOC_2FA_VALID,
		400: DOC_ERROR_INVALID_2FA,
		401: DOC_ERROR_UNAUTHORIZED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
@permission_classes([IsTemporaryToken])
def check_2fa(request):
	token_2fa = request.data.get("token", None)
	if token_2fa is None:
		return Response({"message": MSG_ERROR_TOKEN_REQUIRED}, status=400)
	user = request.user
	if not user.is_2fa_enable:
		return Response({"message": MSG_ERROR_2FA_IS_DISABLE}, status=400)
	device = TOTPDevice.objects.filter(user=user).first()
	if device == None:
		return Response({"message": MSG_ERROR_NO_TOTP_DEVICE}, status=400)
	if device.verify_token(token_2fa):
		if not device.confirmed:
			device.confirmed = True
			device.save()
		user.is_online = True
		user.save()
		token = get_tokens_for_user(user)
		return Response({"message": MSG_LOGIN,
						"data": token}, status=200)
	return Response({"message": MSG_ERROR_WRONG_TOKEN}, status=400)

@swagger_auto_schema(method='put',
	manual_parameters=[JWT_TOKEN],
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['2fa_status'],
		properties={
			'2fa_status': openapi.Schema(type=openapi.TYPE_STRING, description="on or off"),
		}
	),
	responses={
		200: DOC_DISABLE_2FA,
		201: DOC_ENABLE_2FA,
		400: DOC_ERROR_WRONG_2FA_STATUS,
		401: DOC_ERROR_UNAUTHORIZED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['PUT'])
@permission_classes([IsNormalToken])
def update_2fa(request):
	status_2fa = request.data.get("2fa_status", None)
	user = request.user
	if status_2fa not in ('on', 'off'):
		return Response({"message": MSG_ERROR_WRONG_2FA_STATUS}, status=400)
	if user.is_2fa_enable and status_2fa == 'off':
		user.is_2fa_enable = False
		user.save()
		TOTPDevice.objects.filter(user=user).delete()
		return Response({"message": MSG_DISABLE_2FA,
						"data": {"2fa_status" : "off"}}, status=200)
	elif not user.is_2fa_enable and status_2fa == 'on':
		user.is_2fa_enable = True
		user.save()
		if TOTPDevice.objects.filter(user=user).exists():
			TOTPDevice.objects.filter(user=user).delete()
		device = TOTPDevice.objects.create(user=user, name='default', confirmed=False)
		secret_code = device.config_url.split("secret=")[1].split('&')[0]
		qr_code = generate_qr_code(device.config_url)
		return Response({"message": MSG_ENABLE_2FA,
						"data": {"2fa_status" : "on",
								"code": secret_code,
								"qrcode" :f"data:image/png;base64,{qr_code}"}}, status=201)
	else:
		return Response({"message": MSG_ERROR_WRONG_2FA_STATUS}, status=400)

# --------------- Oauth --------------------

@swagger_auto_schema(method='get',
	responses={
		200: DOC_URL_OAUTH42,
	})
@api_view(['GET'])
def get_url_api(request):
	client_id = os.getenv('CLIENT_ID')
	state = os.getenv('STATE')
	redirect = os.getenv('OAUTH_REDIRECT_URL')
	url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect}&response_type=code&scope=public&state={state}"
	return Response({'message' : MSG_SEND_URL_OAUTH,
					'data' : url}, status=200)

@swagger_auto_schema(method='get',
	responses={
		'200': DOC_USER_LOGIN_API42,
		'200bis': DOC_USER_CREATED_API42,
		'200bisbis': DOC_USER_CREATED_API42_WARNING,
		'400/401': DOC_ERROR_LOGIN_API42,
		'405': DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['GET'])
def login_oauth(request):
	if request.GET.get('state') != os.getenv('STATE'):
		return Response({'message' : MSG_ERROR_OAUTH_LOGIN}, status=400)
	error, token = get_token_oauth(request.GET.get('code'))
	if error:
		return Response({'message' : MSG_ERROR_OAUTH_LOGIN}, status=401)
	response = get_user_oauth(token)
	if response.status_code != 200:
		return Response({'message' : MSG_ERROR_OAUTH_INFO}, status=400)
	data = response.json()
	id = data.get('id')
	if not CustomUser.objects.filter(oauth_id=id).exists():
		return create_user_oauth(data)
	return login_user_oauth(id)

# --------------- Update profile --------------------

@swagger_auto_schema(method='put',
	manual_parameters=[JWT_TOKEN],
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['password', 'password2', 'old_password'],
		properties={
			'password': openapi.Schema(type=openapi.TYPE_STRING),
			'password2': openapi.Schema(type=openapi.TYPE_STRING),
			'old_password': openapi.Schema(type=openapi.TYPE_STRING),
		}
	),
	responses={
		200: DOC_UPDATE_PASSWORD,
		400: DOC_IMPOSSIBLE_UPDATE_PASSWORD,
		'400bis': DOC_ERROR_UPDATE_PASSWORD,
		401: DOC_ERROR_UNAUTHORIZED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['PUT'])
@permission_classes([IsNormalToken])
def update_password(request):
	if request.user.oauth_id is not None:
		return Response({"message": MSG_ERROR_UPDATE_PASSWORD_OAUTH}, status=400)
	serializer = UpdatePasswordSerializer(request.user, data=request.data, context={'user': request.user})
	if serializer.is_valid():
		serializer.save()
		return Response({"message" : MSG_PASSWORD_UPDATE}, status=200)
	data = {
		"message" : MSG_ERROR_UPDATE_PASSWORD,
		"data" : serializer.errors
	}
	return Response(data, status=400)

@swagger_auto_schema(method='put',
	manual_parameters=[JWT_TOKEN],
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['username', 'email', 'phone'],
		properties={
			'username': openapi.Schema(type=openapi.TYPE_STRING),
			'email': openapi.Schema(type=openapi.TYPE_STRING),
			'phone': openapi.Schema(type=openapi.TYPE_STRING),
		}
	),
	responses={
		200: DOC_UPDATE_INFO,
		400: DOC_ERROR_UPDATE_INFO,
		401: DOC_ERROR_UNAUTHORIZED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['PUT'])
@permission_classes([IsNormalToken])
def update_user_info(request):
	serializer = UpdateUserSerializer(request.user, data=request.data)
	if serializer.is_valid():
		serializer.save()
		return Response({"message": MSG_INFO_USER_UPDATE,
						"data": serializer.data}, status=200)
	data = {
		"message" : MSG_ERROR_UPDATE_USER_INFO,
		"data" : serializer.errors
	}
	return Response(data, status=400)
