from rest_framework.decorators import api_view, permission_classes
from django_otp.plugins.otp_totp.models import TOTPDevice
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .authentication import IsNormalToken
from .serializer import UserSerializer, UserInfoSerializer
from vault.hvac_vault import get_vault_kv_variable
from .utils import get_token_oauth, get_user_oauth, create_user_oauth, get_tokens_for_user, get_temp_tokens_for_user, login_user_oauth, get_refresh_token
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser
import os
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .doc import (MSG_ERROR_CREATING_USER, MSG_ERROR_NO_ACCOUNT,
	MSG_ERROR_OAUTH_LOGIN, MSG_ERROR_OAUTH_INFO,  MSG_USER_CREATED,
	MSG_LOGIN_NEED_2FA, MSG_LOGIN,  MSG_SEND_URL_OAUTH,
	MSG_ERROR_REFRESH_REQUIRED, MSG_ERROR_CODE_STATE_REQUIRED,
	MSG_ERROR_INVALID_REFRESH_TOKEN, MSG_LOGOUT, MSG_TOKEN_REFRESH,
	DOC_ERROR_METHOD_NOT_ALLOWED, DOC_USER_CREATED, DOC_ERROR_CREATING_USER,
	DOC_USER_LOGIN, DOC_USER_LOGIN_2FA, DOC_ERROR_LOGIN_FAILED,
	DOC_ERROR_UNAUTHORIZED, DOC_ERROR_CREATING_USER_1,
	DOC_URL_OAUTH42, DOC_USER_LOGIN_API42, DOC_USER_CREATED_API42_WARNING,
	DOC_USER_CREATED_API42, DOC_ERROR_LOGIN_API42,
	DOC_LOGOUT, DOC_ERROR_NEED_REFRESH_TOKEN,
	DOC_ERROR_INVALID_TOKEN, DOC_TOKEN_REFRESH)

# --------------- user management --------------------

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
		'400bis': DOC_ERROR_CREATING_USER_1,
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
	if user.is_2fa_enable and TOTPDevice.objects.filter(user=user).first().confirmed:
		token = get_temp_tokens_for_user(user)
		token['2fa_status'] = "on"
		return Response({"message": MSG_LOGIN_NEED_2FA,
					"data" : token}, status=200)
	user.set_status_online()
	token = get_tokens_for_user(user)
	token["2fa_status"] = "off"
	return Response({"message": MSG_LOGIN,
				  	"data" : token}, status=200)

@swagger_auto_schema(method='post',
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['refresh'],
		properties={
			'refresh': openapi.Schema(type=openapi.TYPE_STRING)
		}
	),
	responses={
		200: DOC_LOGOUT,
		400: DOC_ERROR_NEED_REFRESH_TOKEN,
		401: DOC_ERROR_UNAUTHORIZED,
		'401bis': DOC_ERROR_INVALID_TOKEN,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
def logout(request):
	refresh = request.data.get('refresh', None)
	if refresh is None:
		return Response({"message": MSG_ERROR_REFRESH_REQUIRED}, 400)
	try:
		token = RefreshToken(refresh)
		token.blacklist()
		id = token.get('user_id')
		user = CustomUser.objects.get(pk=id)
		user.is_online = False
		user.save()
	except:
		return Response({"message":MSG_ERROR_INVALID_REFRESH_TOKEN}, 401)
	return Response({"message": MSG_LOGOUT}, 200)

@swagger_auto_schema(method='post',
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['refresh'],
		properties={
			'refresh': openapi.Schema(type=openapi.TYPE_STRING)
		}
	),
	responses={
		200: DOC_TOKEN_REFRESH,
		400: DOC_ERROR_NEED_REFRESH_TOKEN,
		401: DOC_ERROR_UNAUTHORIZED,
		'401bis': DOC_ERROR_INVALID_TOKEN,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
def refresh_token(request):
	refresh = request.data.get('refresh', None)
	if refresh is None:
		return Response({"message": MSG_ERROR_REFRESH_REQUIRED}, 400)
	try:
		token = get_refresh_token(refresh)
		return Response({"message": MSG_TOKEN_REFRESH,
						"data" : token}, 200)
	except:
		return Response({"message": MSG_ERROR_INVALID_REFRESH_TOKEN}, 401)

# --------------- Oauth --------------------

@swagger_auto_schema(method='get',
	responses={
		200: DOC_URL_OAUTH42,
	})
@api_view(['GET'])
def get_url_api(request):
	client_id = get_vault_kv_variable('oauth-id')
	state = get_vault_kv_variable('oauth-state')
	redirect = os.getenv('OAUTH_REDIRECT_URL')
	url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect}&response_type=code&scope=public&state={state}"
	return Response({'message' : MSG_SEND_URL_OAUTH,
					'data' : url}, status=200)

@swagger_auto_schema(method='get',
	manual_parameters=[openapi.Parameter('state', openapi.IN_QUERY,description="state receive in the response from API 42", type=openapi.TYPE_STRING, required=True),
		openapi.Parameter('code', openapi.IN_QUERY,description="code receive in the response from API 42", type=openapi.TYPE_STRING, required=True)],
	responses={
		'200': DOC_USER_LOGIN_API42,
		'200bis': DOC_USER_CREATED_API42,
		'200bisbis': DOC_USER_CREATED_API42_WARNING,
		'400/401': DOC_ERROR_LOGIN_API42,
		'400': DOC_ERROR_CREATING_USER_1,
		'405': DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['GET'])
def login_oauth(request):
	state = request.query_params.get("state", None)
	code = request.query_params.get("code", None)
	if state is None or code is None:
		return Response({"message": MSG_ERROR_CODE_STATE_REQUIRED}, status=400)
	if state != get_vault_kv_variable('oauth-state'):
		return Response({'message' : MSG_ERROR_OAUTH_LOGIN}, status=400)
	error, token = get_token_oauth(code)
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

@api_view(['GET'])
@permission_classes([IsNormalToken])
def get_user_info(request):
	serializer = UserInfoSerializer(request.user)
	data = dict(serializer.data)
	data['is_2fa_enable'] = (data['is_2fa_enable'] and TOTPDevice.objects.filter(user=request.user).first().confirmed)
	return Response({"message": "Get user info",
				"data": data}, status=200)
