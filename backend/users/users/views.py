from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializer import UserSerializer#, OauthUserSerializer
from .utils import get_token_oauth, get_user_oauth
from .models import CustomUser
import json
import os

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

@api_view(['POST'])#todo : need to give jwt token
def register_user(request):
	serializer = UserSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
		data = {
			"message" : "User created",
			"data" : serializer.data
		}
		return Response(data, status=201)
	data = {
		"message" : "Error occured while creating user",
		"data" : serializer.errors
	}
	return Response(data, status=404)

# @api_view(['GET'])
# def get_url_api(request):
# 	client_id = os.getenv('CLIENT_ID')
# 	state = os.getenv('STATE')
# 	redirect = os.getenv('REDIRECT_URL')
# 	print(redirect)
# 	url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect}&response_type=code&scope=public&state={state}"
# 	print(url)
# 	return Response({'message' : 'send url to oauth2.0 with 42 API',
# 					'data' : url})

# @api_view(['GET'])
# def login_oauth(request):
# 	print(f"state: {request.GET.get('state')}")
# 	if request.GET.get('state') != os.getenv('STATE'):
# 		return Response(status=status.HTTP_400_BAD_REQUEST)
# 	print(f"code :{request.GET.get('code')}")
# 	token = get_token_oauth(request.GET.get('code'))
# 	print(f"token : {token}")
# 	response = get_user_oauth(token)
# 	print(response.json())
# 	if response.status_code != 200:
# 		return Response("error", status=400)
# 	id = response.json().get('id')
# 	if not CustomUser.objects.filter(oauth_id=id).exists():
# 		serializer = OauthUserSerializer(data=response.json())
# 		if serializer.is_valid():
# 			serializer.save()
# 			print(f'data save: {serializer.data}')
# 		else:
# 			print(f'error: {serializer.errors}')
# 	else:
# 		pass#login
# 	return Response("coucou", status=400)

