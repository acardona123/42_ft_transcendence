from django.http import HttpResponse, JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from django.core.exceptions import BadRequest
from rest_framework.response import Response
import certifi
import requests
import os
import json

@api_view(['GET'])
def get_id(request):
	body = request.body
	# json.loads(body).get('name')
	# check name in database
	dic = {"id" : "7"}
	return JsonResponse(dic)
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


# Create your views here.

def get_url_api(request):
	client_id = os.getenv('CLIENT_ID')
	state = os.getenv('STATE')
	redirect = os.getenv('REDIRECT_URL')
	url = f"https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect}&response_type=code&scope=public&state={state}"
	return url

def get_token(code):
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
		raise BadRequest
	return response.json()['access_token']

def get_user_oauth(token):
	header = {'Authorization' : f'Bearer {token}'}
	return requests.get('https://api.intra.42.fr/v2/me', headers=header, verify=certifi.where())


def auth(request):
	if request.GET.get('state') != os.getenv('STATE'):
		raise BadRequest
	token = get_token(request.GET.get('code'))
	return HttpResponse(get_user_oauth(token))