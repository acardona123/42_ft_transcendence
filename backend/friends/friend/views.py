
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import FriendRequest, Friendship
import requests

def get_id(username):
	url = 'http://users:8002/api/users/id/'
	response = requests.get(url)
	if response.status_code != 200:
		raise NotFound
	return int(response.json().get('id'))

def is_friendship_existed(sender, receiver):
	user1, user2 = sorted([sender, receiver])
	is_existing = Friendship.objects.filter(user1=user1, user2=user2).exists()
	if is_existing:
		return True
	return False

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def send_friend_request(request):
	# if not request.auth:
	# 	return Response({'error' : 'Invalid Token, not user login'},
	# 		status=status.HTTP_401_UNAUTHORIZED)
	sender = 9 #request.auth.get('id')
	receiver_name = request.POST.get('name')
	if not receiver_name:
		return Response({'error' : 'Username not provide'},
			status=status.HTTP_400_BAD_REQUEST)
	
	receiver_id = get_id(receiver_name)
	if receiver_id == sender:
		return Response({'error' : 'already friend with it'},
				status=status.HTTP_406_NOT_ACCEPTABLE)
	request = FriendRequest.objects.filter(sender=receiver_id, receiver=sender).exists()
	if request:
		# add friend
		return Response({'message' : 'friend request already exist'},
				status=status.HTTP_200_OK)
	if is_friendship_existed(sender, receiver_id):
		return Response({'error' : 'friendship already exist'},
				status=status.HTTP_400_BAD_REQUEST)
	friend_request, created = FriendRequest.objects.get_or_create(sender=sender, receiver=receiver_id)
	print(created)
	if created:
		return Response({'message' : 'friend request send'},
				status=status.HTTP_200_OK)
	else:
		return Response({'message' : 'friend request already exist'},
				status=status.HTTP_200_OK)

@api_view(['POST'])
def accept_request(request, request_id):
	friend_request = FriendRequest.objects.get(id=request_id)
	if friend_request.receiver == request.user:
		user1, user2 = sorted([request.user, friend_request.sender])
		friendship, created = Friendship.objects.get_or_create(user1=user1, user2=user2)
		# if created:
		# 	return HttpResponse('friend add')
		# else:
		# 	return HttpResponse('friend already exist')
		friend_request.delete()
		return Response({'error': 'friend request accepted'})
	else:
		return Response({'error': 'friend request not accepted'})
	

@api_view(['GET'])
def request_list(request):
	pass
def friend_list():
	pass
def remove_friend():
	pass
def reject_request():
	pass