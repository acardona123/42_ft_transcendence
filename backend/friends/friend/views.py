
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
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# -----------------------SWAGGER(DOC)---------------------------
MSG_ERROR_NO_USERNAME_BODY = 'Username not provide'
MSG_ERROR_REQUEST_TO_YOURSELF = 'Can\'t send friend request to yourself'
MSG_ERROR_INVALID_ID = 'Invalid id'
MSG_ERROR_INVALID_REQUEST = 'Invalid request'
MSG_ERROR_FRIENSHIP_EXIST = 'Friendship already exists'
MSG_ERROR_USERNAME = 'Error while retreiving username'

MSG_ADD_FRIENSHIP_CREATED = 'Friendship created, and friend request deleted'
MSG_ADD_FRIENSHIP_EXIST = 'Friendship exists, and friend request deleted'
MSG_ADD_FRIEND_REQUEST_CREATED = 'Friend request created'
MSG_ADD_FRIEND_REQUEST_EXIST = 'Friend request exists'
MSG_DELETE_FRIEND_REQUEST = 'Friend request deleted'
MSG_DELETE_FRIENDSHIP = 'Friendship deleted'
MSG_LIST_FRIEND_REQUEST = 'List friend request'
MSG_LIST_FRIENDSHIP = 'List friendship'


DOC_ERROR_RESPONSE = openapi.Response(
				description="Error",
				examples={
					"application/json": {
						'message': MSG_ERROR_INVALID_ID
					}
				}
			)
# ---ADD---
DOC_ADD_FRIEND_REQUEST_RESPONSE = openapi.Response(
			description="return existing friend request",
			examples={
				"application/json": {

					"message": MSG_ADD_FRIEND_REQUEST_EXIST,
					"data": {
						"friend_request": {
							"id": 1,
							"username": "coucou",
							"date": "2024-09-17T15:31:48.750295Z"
						}
					}
				}
			}
		)

DOC_ADD_FRIENDSHIP_RESPONSE = openapi.Response(
			description="return existing friendship",
			examples={
				"application/json": {
				"message": MSG_ADD_FRIENSHIP_EXIST,
				"data": {
					"friendship": {
						"id": 1,
						"username": "coucou"
					},
					"remove_friend_request": 1
					}
				}
			}
		)

# ---DELETE---
DOC_FRIEND_REQUEST_DELETE_RESPONSE = openapi.Response(
			description=MSG_DELETE_FRIEND_REQUEST,
			examples={
				"application/json": {
				'message': MSG_DELETE_FRIEND_REQUEST,
				'data': {'friend_request': 2}
				}
			}
		)

DOC_FRIENDSHIP_DELETE_RESPONSE = openapi.Response(
			description=MSG_DELETE_FRIENDSHIP,
			examples={
				"application/json": {
					'message': MSG_DELETE_FRIENDSHIP,
					'data': {'friendship': 1}
				}
			}
		)

# ---LIST---
DOC_LIST_FRIEND_REQUEST_RESPONSE = openapi.Response(
			description=MSG_LIST_FRIEND_REQUEST,
			examples={
				"application/json": {
					"message": MSG_LIST_FRIEND_REQUEST,
					"data": [
						{
							"id": 3,
							"username": "johanne",
							"date": "2024-09-17T16:10:37.678583Z"
						},
						{
							"id": 4,
							"username": "quentin",
							"date": "2024-09-17T16:10:46.163827Z"
						}
					]
				}
			}
		)

DOC_LIST_FRIENDSHIP_RESPONSE = openapi.Response(
			description=MSG_LIST_FRIENDSHIP,
			examples={
				"application/json": {
					"message": MSG_LIST_FRIENDSHIP,
					"data": [
						{
							"id": 3,
							"username": "johanne"
						},
						{
							"id": 4,
							"username": "quentin"
						}
					]
				}
			}
		)

# ------------------------UTILS-------------------------

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

@swagger_auto_schema(method='post', 
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT, 
		properties={
			'name': openapi.Schema(type=openapi.TYPE_STRING, description='input'),
		}
	),
	responses={
		200: DOC_ADD_FRIEND_REQUEST_RESPONSE,
		'200bis': DOC_ADD_FRIENDSHIP_RESPONSE,
		201: 'friend request created',
		'400/401/404': DOC_ERROR_RESPONSE,
	})
@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def send_friend_request(request):
	# if not request.auth:
	# 	return Response({'message': 'Invalid Token, not user login'},
	# 		status=status.HTTP_401_UNAUTHORIZED)
	sender = 1 #request.auth.get('id')
	receiver_name = request.data.get('name')
	if not receiver_name:
		return Response({'message': MSG_ERROR_NO_USERNAME_BODY},
			status=status.HTTP_400_BAD_REQUEST)
	
	receiver_id = get_id(receiver_name)
	if receiver_id == sender:
		return Response({'message': MSG_ERROR_REQUEST_TO_YOURSELF},
				status=status.HTTP_400_BAD_REQUEST)
	if is_friendship_existed(sender, receiver_id):
		return Response({'message': MSG_ERROR_FRIENSHIP_EXIST},
				status=status.HTTP_400_BAD_REQUEST)
	request = FriendRequest.objects.filter(sender=receiver_id, receiver=sender).exists()
	if request:
		friendship, created = add_frienship(sender, receiver_id)
		remove_request = FriendRequest.objects.filter(sender=receiver_id, receiver=sender)
		remove_request_id = remove_request.first().id
		remove_request.delete()
		data = {'message': MSG_ADD_FRIENSHIP_CREATED if created else MSG_ADD_FRIENSHIP_EXIST,
			'data': {'friendship': FriendshipSerializer(friendship, context= {'user_id':sender, 'username':receiver_name}).data,
					'remove_friend_request': remove_request_id}}
		return Response(data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
	friend_request, created = FriendRequest.objects.get_or_create(sender=sender, receiver=receiver_id)
	data = {'message': MSG_ADD_FRIEND_REQUEST_CREATED if created else MSG_ADD_FRIEND_REQUEST_EXIST,
			'data': {'friend_request': FriendRequestSerializer(friend_request, fields=('id', 'username', 'date'), context={'username': receiver_name}).data}}
	return Response(data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

@swagger_auto_schema(method='post',
	responses={
		200: DOC_ADD_FRIENDSHIP_RESPONSE,
		201: 'friend request created',
		'400/401/500': DOC_ERROR_RESPONSE,
	})
@swagger_auto_schema(method='delete',
	responses={
		200: DOC_FRIEND_REQUEST_DELETE_RESPONSE,
		'400/401': DOC_ERROR_RESPONSE,
	})
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
		return Response({'message' : MSG_ERROR_INVALID_ID},
				status=status.HTTP_400_BAD_REQUEST)
	if friend_request.receiver != receiver_id:
		return Response({'message': MSG_ERROR_INVALID_REQUEST},
				status=status.HTTP_400_BAD_REQUEST)
	if request.method == 'POST':
		friendship, created = add_frienship(receiver_id, friend_request.sender)
		friend_request.delete()
		try:
			data = {'message': MSG_ADD_FRIENSHIP_CREATED if created else MSG_ADD_FRIENSHIP_EXIST,
				'data': {'friendship': FriendshipSerializer(friendship, context= {'user_id':receiver_id}).data,
						'remove_friend_request': request_id}}
			return Response(data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
		except:
			return Response({'message': MSG_ERROR_USERNAME},
					status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	else:
		friend_request.delete()
		data = {'message': MSG_DELETE_FRIEND_REQUEST,
				'data': {'friend_request': request_id}}
		return Response(data, status=status.HTTP_200_OK)

@swagger_auto_schema(method='get',
	responses={
		200: DOC_LIST_FRIEND_REQUEST_RESPONSE,
		'401/500': DOC_ERROR_RESPONSE,
	})
@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def request_list(request):
	# if not request.auth:
	# 	return Response({'error' : 'Invalid Token, not user login'},
	# 		status=status.HTTP_401_UNAUTHORIZED)
	user_id = 7 #request.auth.get('id')
	friend_request = FriendRequest.objects.filter(receiver=user_id).order_by('-date')
	try:
		serializer = FriendRequestSerializer(friend_request, fields=['id', 'username', 'date'], many=True)
		return Response({'message': MSG_LIST_FRIEND_REQUEST,
					'data': serializer.data}, status=status.HTTP_200_OK)
	except:
		return Response({'message': MSG_ERROR_USERNAME},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ------------------------FRIENDSHIP-------------------------

@swagger_auto_schema(method='get',
	responses={
		200: DOC_LIST_FRIENDSHIP_RESPONSE,
		'401/500': DOC_ERROR_RESPONSE,
	})
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
		return Response({'message': MSG_LIST_FRIENDSHIP,
					'data': serializer.data}, status=status.HTTP_200_OK)
	except:
		return Response({'message': MSG_ERROR_USERNAME},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@swagger_auto_schema(method='delete',
	responses={
		200: DOC_FRIENDSHIP_DELETE_RESPONSE,
		'400/401': DOC_ERROR_RESPONSE,
	})
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
		return Response({'message' : MSG_ERROR_INVALID_ID},
				status=status.HTTP_400_BAD_REQUEST)
	if user_id != friendship.user1 and user_id != friendship.user2:
		return Response({'message' : MSG_ERROR_INVALID_REQUEST},
				status=status.HTTP_400_BAD_REQUEST)
	friendship.delete()
	data = {'message': MSG_DELETE_FRIENDSHIP,
				'data': {'friendship': friendship_id}}
	return Response(data, status=status.HTTP_200_OK)
