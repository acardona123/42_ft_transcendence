from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from users.models import CustomUser
# from users.serializer import UserSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@api_view(['POST'])
def get_username_by_id(request):
	users_id = request.data.get("users_id", None)
	if users_id is None:
		return Response({"message": "The field 'users_id' is required"}, status=400)
	users = CustomUser.objects.filter(pk__in=users_id)
	print(users)
	data = dict()
	for user in users:
		data[user.id] = user.username
	return Response({"message": "Id associated with username",
					"data": data})

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
