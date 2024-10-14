from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from users.models import CustomUser
# from users.serializer import UserSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from users.utils import get_random_word
import random
import uuid

# ---------------- DOC --------------------------
MSG_ERROR_USER_ID_REQUIRED = "The field 'users_id' is required"
MSG_ERROR_USERNAME_REQUIRED = "The field 'username' is required"
MSG_ERROR_USER_ID_ONLY_INTEGERS = "The field 'users_id' must contain only integer"
MSG_ERROR_USER_NOT_FOUND = "Error user not found"
MSG_ERROR_USERNAME_PIN_REQUIRED = "The field 'username' and 'pin' is required"
MSG_ERROR_INVALID_USERNAME_PIN = "Incorrect username or pin"

MSG_ID_USERNAME = "Id associated with username"
MSG_ID_USERNAME_INFO = "Id associated with username, picture and online status"
MSG_AI_CREATED = "AI created"
MSG_GUEST_CREATED = "Guest user created"
MSG_TYPE_USER = "Get type of user"
MSG_USER_LOGIN_PIN = "User login with pin to play game"

DOC_ERROR_METHOD_NOT_ALLOWED = openapi.Response(
			description="Method Not Allowed",
			examples={
				"application/json": {
					"detail": "Method \"PUT\" not allowed."
					}
			}
		)

DOC_ERROR_USER_ID = openapi.Response(
			description=MSG_ERROR_USER_ID_REQUIRED + " or " + MSG_ERROR_USER_ID_ONLY_INTEGERS,
			examples={
				"application/json": {"message": MSG_ERROR_USER_ID_REQUIRED}
			}
		)

DOC_USER_ID = openapi.Response(
			description=MSG_ID_USERNAME,
			examples={
				"application/json": {"message": MSG_ID_USERNAME,
						"data": {'1': 'coucou',
							'2': 'bonjour',
							'5': 'hey'}}
			}
		)

DOC_USER_INFO = openapi.Response(
			description=MSG_ID_USERNAME_INFO,
			examples={
				"application/json": {"message": MSG_ID_USERNAME_INFO,
					"data": {
					"1": {
					"username": "root",
					"picture": "https://localhost:8443/api/users/media/profile_pictures/default.jpg",
					"status": "online"
					},
					"10": {
					"username": "hey",
					"picture": "https://cdn.intra.42.fr/users/f918d2fa74c06509c8413fe4006f1235/small_hey.jpg",
					"status": "inactif"
					},
					"8": {
					"username": "coucou#7236",
					"picture": "https://localhost:8443/api/users/media/profile_pictures/8_412bca24fc144e4bba91078e2dd18e23.png",
					"status": "offline"
					}
				}}
			}
		)

DOC_AI_CREATED = openapi.Response(
			description=MSG_AI_CREATED,
			examples={
				"application/json": {"message": MSG_AI_CREATED,
					"data": {"id" : '45',
						"username": 'AI#1563'}}
			}
		)

DOC_GUEST_CREATED = openapi.Response(
			description=MSG_GUEST_CREATED,
			examples={
				"application/json": {"message": MSG_GUEST_CREATED,
					"data": {"id" : '45',
						"username": 'Guest#1563'}}
			}
		)

DOC_USER_TYPE = openapi.Response(
			description=MSG_TYPE_USER+" can be User, Bot, Guest",
			examples={
				"application/json": {"message": MSG_TYPE_USER,
					"data": {"type" : 'User'}}
			}
		)

DOC_ERROR_USER_NOT_FOUND = openapi.Response(
			description=MSG_ERROR_USER_NOT_FOUND,
			examples={
				"application/json": {"message": MSG_ERROR_USER_NOT_FOUND}
			}
		)

DOC_ERROR_LOGIN_PIN= openapi.Response(
			description=MSG_ERROR_USERNAME_PIN_REQUIRED+" or "+MSG_ERROR_INVALID_USERNAME_PIN,
			examples={
				"application/json": {"message": MSG_ERROR_USERNAME_PIN_REQUIRED}
			}
		)

DOC_LOGIN_PIN= openapi.Response(
			description=MSG_USER_LOGIN_PIN,
			examples={
				"application/json": {"message": MSG_USER_LOGIN_PIN}
			}
		)

DOC_ERROR_USERNAME= openapi.Response(
			description=MSG_ERROR_USERNAME_REQUIRED+' or '+MSG_ERROR_USER_NOT_FOUND,
			examples={
				"application/json": {"message": MSG_ERROR_USER_NOT_FOUND}
			}
		)

DOC_GET_USERNAME= openapi.Response(
			description=MSG_ID_USERNAME,
			examples={
				"application/json": {"message": MSG_ID_USERNAME,
						'data':{'id' : 5}}
			}
		)

# ---------------- VIEW --------------------------

@swagger_auto_schema(method='post',
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['users_id'],
		properties={
			'users_id': openapi.Schema(type=openapi.TYPE_STRING, description="list of user Id"),
		}
	),
	responses={
		200: DOC_USER_ID,
		400: DOC_ERROR_USER_ID,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
def get_username_by_id(request):
	users_id = request.data.get("users_id", None)
	if users_id is None:
		return Response({"message": MSG_ERROR_USER_ID_REQUIRED}, status=400)
	if not all(isinstance(number, (int)) for number in users_id):
		return Response({"message": MSG_ERROR_USER_ID_ONLY_INTEGERS}, status=400)
	users = CustomUser.objects.filter(pk__in=users_id)
	data = dict()
	for user in users:
		data[user.id] = user.username
	return Response({"message": MSG_ID_USERNAME,
					"data": data})

@swagger_auto_schema(method='post',
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['users_id'],
		properties={
			'users_id': openapi.Schema(type=openapi.TYPE_STRING, description="list of user Id"),
		}
	),
	responses={
		200: DOC_USER_INFO,
		400: DOC_ERROR_USER_ID,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
def get_friend_info_by_id(request):
	users_id = request.data.get("users_id", None)
	if users_id is None:
		return Response({"message": MSG_ERROR_USER_ID_REQUIRED}, status=400)
	if not all(isinstance(number, (int)) for number in users_id):
		return Response({"message": MSG_ERROR_USER_ID_ONLY_INTEGERS}, status=400)
	users = CustomUser.objects.filter(pk__in=users_id)
	data = dict()
	for user in users:
		data[user.id] = {'username': user.username,
					'picture': user.get_picture(),
					'status': user.get_status()}
	return Response({"message": MSG_ID_USERNAME_INFO,
					"data": data})

@swagger_auto_schema(method='post',
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['username'],
		properties={
			'username': openapi.Schema(type=openapi.TYPE_STRING),
		}
	),
	responses={
		200: DOC_GET_USERNAME,
		400: DOC_ERROR_USERNAME,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
def get_user_id(request):
	username = request.data.get("username", None)
	if username is None:
		return Response({"message": MSG_ERROR_USERNAME_REQUIRED}, status=400)
	try:
		user = CustomUser.objects.get(username=username)
		return Response({'message': MSG_ID_USERNAME,
					'data': {'id': user.id}}, status=200)
	except CustomUser.DoesNotExist:
		return Response({'message': MSG_ERROR_USER_NOT_FOUND}, status=400)

def get_random_ai_username():
	while True:
		word = f"AI#{random.randint(000000,999999):04d}"
		if not CustomUser.objects.filter(username=word).exists():
			break
	return word

@swagger_auto_schema(method='post',
	responses={
		200: DOC_AI_CREATED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
def create_ai(request):
	username = get_random_ai_username()
	user = CustomUser.objects.create_user(username, password=None, type=CustomUser.UserType.BOT)
	return Response({"message": MSG_AI_CREATED,
					"data": {"id" : user.id,
							"username": user.username}}, status=200)

def get_random_username():
	while True:
		word = f"{get_random_word()}#{random.randint(0000,9999):04d}"
		if not CustomUser.objects.filter(username=word).exists():
			break
	return word

@swagger_auto_schema(method='post',
	responses={
		200: DOC_GUEST_CREATED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
def create_guest(request):
	username = get_random_username()
	user = CustomUser.objects.create_user(username, password=None, type=CustomUser.UserType.GST)
	return Response({"message": MSG_GUEST_CREATED,
					"data": {"id" : user.id,
							"username": user.username}}, status=200)

@swagger_auto_schema(method='get',
	responses={
		200: DOC_USER_TYPE,
		400: DOC_ERROR_USER_NOT_FOUND,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['GET'])
def get_type_user(request, user_id):
	try:
		user = CustomUser.objects.get(id=user_id)
		return Response({"message": MSG_TYPE_USER,
						"data": {"type": user.type}}, status=200)
	except Exception as error:
		return Response({"message": MSG_ERROR_USER_NOT_FOUND}, status=400)

@swagger_auto_schema(method='post',
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['username', 'pin'],
		properties={
			'username': openapi.Schema(type=openapi.TYPE_STRING),
			'pin': openapi.Schema(type=openapi.TYPE_STRING),
		}
	),
	responses={
		200: DOC_LOGIN_PIN,
		400: DOC_ERROR_LOGIN_PIN,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
def check_pin_code(request):
	username = request.data.get("username", None)
	pin = request.data.get("pin", None)
	if username is None or pin is None:
		return Response({"message": MSG_ERROR_USERNAME_PIN_REQUIRED}, status=400)
	try:
		user = CustomUser.objects.get(username=username)
		if user.pin != pin:
			raise
		return Response({"message": MSG_USER_LOGIN_PIN}, status=200)
	except:
		return Response({"message": MSG_ERROR_INVALID_USERNAME_PIN}, status=400)
