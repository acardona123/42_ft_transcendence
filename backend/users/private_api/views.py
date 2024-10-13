from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from users.models import CustomUser
# from users.serializer import UserSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
import random
import uuid

@api_view(['POST'])
def get_username_by_id(request):
	users_id = request.data.get("users_id", None)
	if users_id is None:
		return Response({"message": "The field 'users_id' is required"}, status=400)
	if not all(isinstance(number, (int)) for number in users_id):
		return Response({"message": "The field 'users_id' must contain only integer"}, status=400)
	users = CustomUser.objects.filter(pk__in=users_id)
	data = dict()
	for user in users:
		data[user.id] = user.username
	return Response({"message": "Id associated with username",
					"data": data})

def get_random_ai_username(): # todo username random + check username unique
	return "AI#"+str(random.randint(0000,9999))

@api_view(['POST'])
def create_ai(request):
	username = get_random_ai_username()
	user = CustomUser.objects.create_user(username, password=None, type=CustomUser.UserType.BOT)
	return Response({"message": "AI created",
					"data": {"id" : user.id,
							"username": user.username}}, status=200)

def get_random_guest_username(): # todo username random + check username unique
	return "Guest#"+str(random.randint(0000,9999))

@api_view(['POST'])
def create_guest(request):
	username = get_random_guest_username()
	user = CustomUser.objects.create_user(username, password=None, type=CustomUser.UserType.GST)
	return Response({"message": "Guest user created",
					"data": {"id" : user.id,
							"username": user.username}}, status=200)

@api_view(['GET'])
def get_type_user(request, user_id):
	try:
		user = CustomUser.objects.get(id=user_id)
		return Response({"message": "Get type of user",
						"data": {"type": user.type}}, status=200)
	except Exception as error:
		return Response({"message": "Error user not found"}, status=400)

@api_view(['POST'])
def check_pin_code(request):
	username = request.data.get("username", None)
	pin = request.data.get("pin", None)
	if username is None or pin is None:
		return Response({"message": "The field 'username' and 'pin' is required"}, status=400)
	try:
		user = CustomUser.objects.get(username=username)
		if user.pin != pin:
			raise
		return Response({"message": "User login with pin to play game"}, status=200)
	except:
		return Response({"message": "Incorrect username or pin"}, status=400)
