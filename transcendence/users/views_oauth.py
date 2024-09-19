# Oauth 2.0

from django.shortcuts import render
from django.http import HttpResponse
from django.core.exceptions import BadRequest
import certifi
import requests
import os

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