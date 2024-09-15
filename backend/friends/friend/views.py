
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from friend.models import FriendRequest, Friendship
from friend.serializer import FriendRequestSerializer, FriendshipSerializer
from django.db.models import Q
from django.conf import settings
import requests

def get_id(username):
	url = f"{settings.USERS_MICROSERVICE_URL}/api/users/id/"
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

def add_frienship(user1, user2):
	user1, user2 = sorted([user1, user2])
	friendship, created = Friendship.objects.get_or_create(user1=user1, user2=user2)
	return created

# ------------------------FRIENDREQUEST-------------------------

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def send_friend_request(request):
	# if not request.auth:
	# 	return Response({'error' : 'Invalid Token, not user login'},
	# 		status=status.HTTP_401_UNAUTHORIZED)
	sender = 7 #request.auth.get('id')
	receiver_name = request.data.get('name')
	if not receiver_name:
		return Response({'error' : 'Username not provide'},
			status=status.HTTP_400_BAD_REQUEST)
	
	receiver_id = get_id(receiver_name)
	if receiver_id == sender:
		return Response({'error' : 'already friend with it'},
				status=status.HTTP_406_NOT_ACCEPTABLE)
	if is_friendship_existed(sender, receiver_id):
		return Response({'error' : 'friendship already exist'},
				status=status.HTTP_400_BAD_REQUEST)
	request = FriendRequest.objects.filter(sender=receiver_id, receiver=sender).exists()
	if request:
		created = add_frienship(sender, receiver_id)
		FriendRequest.objects.filter(sender=receiver_id, receiver=sender).delete()
		if created:
			return Response({'error': 'friend request accepted'},
					status=status.HTTP_200_OK)
		else:
			return Response({'error': 'friendship already exist'},
					status=status.HTTP_200_OK)
	friend_request, created = FriendRequest.objects.get_or_create(sender=sender, receiver=receiver_id)
	print(created)
	if created:
		return Response({'message' : 'friend request send'},
				status=status.HTTP_200_OK)
	else:
		return Response({'message' : 'friend request already exist'},
				status=status.HTTP_200_OK)

@api_view(['POST', 'DELETE'])
# @permission_classes([IsAuthenticated])
def manage_request(request, request_id):
	# if not request.auth:
	# 	return Response({'error' : 'Invalid Token, not user login'},
	# 		status=status.HTTP_401_UNAUTHORIZED)
	receiver_id = 7 #request.auth.get('id')
	try:
		friend_request = FriendRequest.objects.get(id=request_id)
	except FriendRequest.DoesNotExist:
		return Response({'error' : 'invalid request id'},
				status=status.HTTP_400_BAD_REQUEST)
	if friend_request.receiver != receiver_id:
		return Response({'error': 'friend request invalid'},
				status=status.HTTP_400_BAD_REQUEST)
	if request.method == 'POST':
		created = add_frienship(receiver_id, friend_request.sender)
		friend_request.delete()
		if created:
			return Response({'error': 'friend request accepted'},
					status=status.HTTP_200_OK)
		else:
			return Response({'error': 'friendship already exist'},
					status=status.HTTP_200_OK)
	elif request.method == 'DELETE':
		friend_request.delete()
		return Response({'error': 'friendship rejected'},
				status=status.HTTP_200_OK)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def request_list(request):
	# if not request.auth:
	# 	return Response({'error' : 'Invalid Token, not user login'},
	# 		status=status.HTTP_401_UNAUTHORIZED)
	user_id = 7 #request.auth.get('id')
	friend_request = FriendRequest.objects.filter(receiver=user_id)
	try:
		serializer = FriendRequestSerializer(friend_request, fields=['id', 'username'], many=True)
		print(serializer.data)
		return JsonResponse(serializer.data, safe=False)
	except:
		return Response({'error': 'retrieving username'},
			status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ------------------------FRIENDSHIP-------------------------

@api_view(['GET'])
# @permission_classes([IsAuthenticated])

def friend_list(request):
# if not request.auth:
	# 	return Response({'error' : 'Invalid Token, not user login'},
	# 		status=status.HTTP_401_UNAUTHORIZED)
	user_id = 7 #request.auth.get('id')
	friendship = Friendship.objects.filter(Q(user1=user_id) | Q(user2=user_id))
	print(friendship)
	try:
		serializer = FriendshipSerializer(friendship, many=True, context={'user_id': user_id})
		print(serializer.data)
		return JsonResponse(serializer.data, safe=False)
	except:
		return Response({'error': 'retrieving username and picture'},
			status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
# @permission_classes([IsAuthenticated])
def remove_friend(request, friendship_id):
	# if not request.auth:
	# 	return Response({'error' : 'Invalid Token, not user login'},
	# 		status=status.HTTP_401_UNAUTHORIZED)
	user_id = 7 #request.auth.get('id')
	try:
		friendship = Friendship.objects.get(id=friendship_id)
	except Friendship.DoesNotExist:
		return Response({'error' : 'invalid friendship id'},
				status=status.HTTP_400_BAD_REQUEST)
	print(friendship)
	if user_id != friendship.user1 and user_id != friendship.user2:
		return Response({'error' : 'not part of the friendship'},
				status=status.HTTP_401_UNAUTHORIZED)
	friendship.delete()
	return Response({'message' : 'friendship delete'}, status=status.HTTP_200_OK)
