
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
	return Friendship.objects.get_or_create(user1=user1, user2=user2)

# ------------------------FRIENDREQUEST-------------------------

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def send_friend_request(request):
	# if not request.auth:
	# 	return Response({'message': 'Invalid Token, not user login'},
	# 		status=status.HTTP_401_UNAUTHORIZED)
	sender = 4 #request.auth.get('id')
	receiver_name = request.data.get('name')
	if not receiver_name:
		return Response({'message': 'Username not provide'},
			status=status.HTTP_400_BAD_REQUEST)
	
	receiver_id = get_id(receiver_name)
	if receiver_id == sender:
		return Response({'message': 'can\'t send friend request to your self'},
				status=status.HTTP_400_BAD_REQUEST)
	if is_friendship_existed(sender, receiver_id):
		return Response({'message': 'friendship already exist'},
				status=status.HTTP_400_BAD_REQUEST)
	request = FriendRequest.objects.filter(sender=receiver_id, receiver=sender).exists()
	if request:
		friendship, created = add_frienship(sender, receiver_id)
		remove_request = FriendRequest.objects.filter(sender=receiver_id, receiver=sender)
		remove_request_id = remove_request.first().id
		remove_request.delete()
		data = {'message': 'friendship '+('created' if created else 'exist')+', and friend request deleted',
			'data': {'friendship': FriendshipSerializer(friendship, context= {'user_id':sender, 'username':receiver_name}).data,
					'remove_friend_request': remove_request_id}}
		return Response(data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
	friend_request, created = FriendRequest.objects.get_or_create(sender=sender, receiver=receiver_id)
	data = {'message': 'friend request created' if created else 'friend request exist',
			'data': {'friend_request': FriendRequestSerializer(friend_request, fields=('id', 'username', 'date'), context={'username': receiver_name}).data}}
	return Response(data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

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
		return Response({'message' : 'invalid request id'},
				status=status.HTTP_400_BAD_REQUEST)
	if friend_request.receiver != receiver_id:
		return Response({'message': 'friend request invalid'},
				status=status.HTTP_400_BAD_REQUEST)
	if request.method == 'POST':
		friendship, created = add_frienship(receiver_id, friend_request.sender)
		friend_request.delete()
		try:
			data = {'message': 'friendship '+('created' if created else 'exist')+', and friend request deleted',
				'data': {'friendship': FriendshipSerializer(friendship, context= {'user_id':receiver_id}).data,
						'remove_friend_request': request_id}}
			return Response(data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
		except:
			return Response({'message': 'error will retreiving username'},
					status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	else:
		friend_request.delete()
		data = {'message': 'friend request deleted',
				'data': {'friend_request': request_id}}
		return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def request_list(request):
	# if not request.auth:
	# 	return Response({'error' : 'Invalid Token, not user login'},
	# 		status=status.HTTP_401_UNAUTHORIZED)
	user_id = 7 #request.auth.get('id')
	friend_request = FriendRequest.objects.filter(receiver=user_id)
	try:
		serializer = FriendRequestSerializer(friend_request, fields=['id', 'username', 'date'], many=True)
		return Response({'message':'list friend request',
					'data': serializer.data}, status=status.HTTP_200_OK)
	except:
		return Response({'message': 'error will retreiving username'},
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
	try:
		serializer = FriendshipSerializer(friendship, many=True, context={'user_id': user_id})
		return Response({'message':'list friendship',
					'data': serializer.data}, status=status.HTTP_200_OK)
	except:
		return Response({'message': 'error will retreiving username'},
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
		return Response({'message' : 'invalid friendship id'},
				status=status.HTTP_400_BAD_REQUEST)
	if user_id != friendship.user1 and user_id != friendship.user2:
		return Response({'message' : 'not part of the friendship'},
				status=status.HTTP_400_BAD_REQUEST)
	friendship.delete()
	data = {'message': 'friendship deleted',
				'data': {'friendship': friendship_id}}
	return Response(data, status=status.HTTP_200_OK)
