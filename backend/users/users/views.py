from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializer import UserSerializer, UpdatePasswordSerializer, UpdateUserSerializer
from .utils import get_token_oauth, get_user_oauth, create_user_oauth, get_tokens_for_user, login_user_oauth
from .models import CustomUser
import json
import os

@api_view(['GET'])
def get_id(request):
	body = request.body
	# json.loads(body).get('name')
	# check name in database
	dic = {"id" : "7"}
	return Response(dic)
	# return HttpResponse(status=status.HTTP_408_REQUEST_TIMEOUT)

@api_view(['POST'])
def get_usernames(request):
	body = request.body
	print(body)
	users = json.loads(body).get('users')
	print(users)
	#get username in the database
	list = ['johanne', 'quentin', 'arthur', 'alex', 'alexandre', 'jeanne', 'ulysse', 'user1', 'user2']
	dic = dict()
	i = 0
	for user in users:
		dic[user] = list[i]
		i+=1
	return Response(dic)

@api_view(['POST'])
def register_user(request):
	serializer = UserSerializer(data=request.data)
	if serializer.is_valid():
		user = serializer.save()
		tokens = get_tokens_for_user(user)
		data = {
			"message" : "User created",
			"data" : {'user': serializer.data, 'tokens': tokens}
		}
		return Response(data, status=201)
	data = {
		"message" : "Error occured while creating user",
		"data" : serializer.errors
	}
	return Response(data, status=404)

@api_view(['POST'])
def login_user(request):
	username = request.data.get('username', None)
	password = request.data.get('password', None)
	user = authenticate(username=username, password=password)
	if user is None:
		return Response({"message": "No active account found with the given credentials"}, status=401)
	token = get_tokens_for_user(user)
	return Response({"message": "User login successfully",
				  	"data" : token}, status=200)

# --------------- Oauth --------------------

@api_view(['GET'])
def get_url_api(request):
	client_id = os.getenv('CLIENT_ID')
	state = os.getenv('STATE')
	redirect = os.getenv('REDIRECT_URL')
	url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect}&response_type=code&scope=public&state={state}"
	return Response({'message' : 'send url to oauth2.0 with 42 API',
					'data' : url})

@api_view(['GET'])
def login_oauth(request):
	if request.GET.get('state') != os.getenv('STATE'):
		return Response(status=status.HTTP_400_BAD_REQUEST)
	error, token = get_token_oauth(request.GET.get('code'))
	if error:
		return Response({'message' : 'Unauthorized to login with API 42'}, status=401)
	response = get_user_oauth(token)
	if response.status_code != 200:
		return Response("error", status=400)
	data = response.json()
	id = data.get('id')
	if not CustomUser.objects.filter(oauth_id=id).exists():
		return create_user_oauth(data)
	return login_user_oauth(id)

# --------------- Update profile --------------------

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_password(request):
	if request.user.oauth_id is not None:
		return Response({"message" : "Impossible to update password with 42 API"}, status=400)
	serializer = UpdatePasswordSerializer(request.user, data=request.data, context={'user': request.user})
	if serializer.is_valid():
		serializer.save()
		return Response({"message" : "Password updated"}, status=200)
	data = {
		"message" : "Error occured while updating password",
		"data" : serializer.errors
	}
	return Response(data, status=400)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_info(request):
	serializer = UpdateUserSerializer(request.user, data=request.data)
	if serializer.is_valid():
		serializer.save()
		return Response({"message": "User info updated",
						"data": serializer.data}, status=200)
	data = {
		"message" : "Error occured while updating user info",
		"data" : serializer.errors
	}
	return Response(data, status=400)

# --------------- Debug --------------------

from rest_framework import generics
from .serializer import TestSerializer

class UserListView(generics.ListAPIView):
	queryset = CustomUser.objects.all()
	serializer_class = TestSerializer