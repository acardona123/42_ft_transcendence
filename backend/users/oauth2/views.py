from django.shortcuts import render
from django.http import HttpResponse
from django.core.exceptions import BadRequest
import certifi
import requests
import os

# Create your views here.

def index(request):
	return render(request, 'index.html', context={})

def get_token(code):
	data = {
		'grant_type' : 'authorization_code',
		'client_id' : os.getenv('CLIENT_ID'),
		'client_secret' : os.getenv('CLIENT_SECRET'),
		'code' : code,
		'redirect_uri' : 'https://localhost:8443/api/users/auth/',
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