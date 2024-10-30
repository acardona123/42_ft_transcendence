
from .authentication import IsNormalToken
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
MSG_ERROR_INVALID_USERNAME = 'Invalid username'
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

JWT_TOKEN = openapi.Parameter('Authentication : Bearer XXX',openapi.IN_HEADER,description="jwt access token", type=openapi.IN_HEADER, required=True)

DOC_ERROR_METHOD_NOT_ALLOWED = openapi.Response(
			description="Method Not Allowed",
			examples={
				"application/json": {
					"detail": "Method \"PUT\" not allowed."
					}
			}
		)

DOC_ERROR_UNAUTHORIZED = openapi.Response(
			description="Unauthorized to access the page, need to have jwt",
			examples={
				"application/json": {
					"detail": "Given token not valid for any token type",
					"code": "token_not_valid",
					"messages": [
						{
						"token_class": "AccessToken",
						"token_type": "access",
						"message": "Token is invalid or expired"
						}
					]
				}
			}
		)

DOC_ERROR_USERNAME = openapi.Response(
				description=MSG_ERROR_USERNAME,
				examples={
					"application/json": {
						'message': MSG_ERROR_USERNAME
					}
				}
			)

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
						"username": "coucou",
						"profile_picture": "https://fdgfjghkdf",
						"status": "offline"
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
							"username": "johanne",
							"profile_picture": "https://fdgfjghkdf",
							"status": "offline"
						},
						{
							"id": 4,
							"username": "quentin",
							"profile_picture": "https://fdgfjghkdf",
							"status": "online"
						},
						{
							"id": 4,
							"username": "quentin",
							"profile_picture": "https://fdgfjghkdf",
							"status": "inactif"
						}
					]
				}
			}
		)

# ------------------------UTILS-------------------------

def get_id(username):
	url = f"{settings.USERS_MICROSERVICE_URL}/api/private/users/retrieve/id/"
	response = requests.post(url, json={'username': username})
	if response.status_code != 200:
		return None
	data = response.json().get('data',None)
	if data != None:
		data = data.get('id', None)
	return data

def is_friendship_existed(sender, receiver):
	user1, user2 = sorted([sender, receiver])
	is_existing = Friendship.objects.filter(user1=user1, user2=user2).exists()
	return is_existing

def add_frienship(user1, user2):
	user1, user2 = sorted([user1, user2])
	return Friendship.objects.get_or_create(user1=user1, user2=user2)


# ------------------------FRIENDREQUEST-------------------------

@swagger_auto_schema(method='post',
	manual_parameters=[JWT_TOKEN],
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
		400: DOC_ERROR_RESPONSE,
		401: DOC_ERROR_UNAUTHORIZED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
		500: DOC_ERROR_USERNAME
	})
@api_view(['POST'])
@permission_classes([IsNormalToken])
def send_friend_request(request):
	sender = request.user.id
	receiver_name = request.data.get('name', None)
	if not receiver_name:
		return Response({'message': MSG_ERROR_NO_USERNAME_BODY}, status=400)
	
	receiver_id = get_id(receiver_name)
	if receiver_id == None:
		return Response({'message': MSG_ERROR_INVALID_USERNAME}, status=400)
	receiver_id = int(receiver_id)
	if receiver_id == sender:
		return Response({'message': MSG_ERROR_REQUEST_TO_YOURSELF}, status=400)
	if is_friendship_existed(sender, receiver_id):
		return Response({'message': MSG_ERROR_FRIENSHIP_EXIST}, status=400)
	if FriendRequest.objects.filter(sender=receiver_id, receiver=sender).exists():
		friendship, created = add_frienship(sender, receiver_id)
		remove_request = FriendRequest.objects.filter(sender=receiver_id, receiver=sender)
		remove_request_id = remove_request.first().id
		remove_request.delete()
		try:
			data = {'message': MSG_ADD_FRIENSHIP_CREATED if created else MSG_ADD_FRIENSHIP_EXIST,
				'data': {'friendship': FriendshipSerializer(friendship, context= {'user_id':sender}).data,
						'remove_friend_request': remove_request_id}}
			return Response(data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
		except:
			return Response({'message': MSG_ERROR_USERNAME},
					status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	friend_request, created = FriendRequest.objects.get_or_create(sender=sender, receiver=receiver_id)
	data = {'message': MSG_ADD_FRIEND_REQUEST_CREATED if created else MSG_ADD_FRIEND_REQUEST_EXIST,
			'data': {'friend_request': FriendRequestSerializer(friend_request, fields=('id', 'username', 'date'), context={'username': receiver_name}).data}}
	return Response(data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

@swagger_auto_schema(method='post',
	manual_parameters=[JWT_TOKEN],
	responses={
		200: DOC_ADD_FRIENDSHIP_RESPONSE,
		201: 'friend request created',
		400: DOC_ERROR_RESPONSE,
		401: DOC_ERROR_UNAUTHORIZED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
		500: DOC_ERROR_USERNAME,
	})
@swagger_auto_schema(method='delete',
	manual_parameters=[JWT_TOKEN],
	responses={
		200: DOC_FRIEND_REQUEST_DELETE_RESPONSE,
		400: DOC_ERROR_RESPONSE,
		401: DOC_ERROR_UNAUTHORIZED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED
	})
@api_view(['POST', 'DELETE'])
@permission_classes([IsNormalToken])
def manage_request(request, request_id):
	receiver_id = request.user.id
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
	manual_parameters=[JWT_TOKEN],
	responses={
		200: DOC_LIST_FRIEND_REQUEST_RESPONSE,
		401: DOC_ERROR_UNAUTHORIZED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
		500: DOC_ERROR_USERNAME
	})
@api_view(['GET'])
@permission_classes([IsNormalToken])
def request_list(request):
	user_id = request.user.id
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
	manual_parameters=[JWT_TOKEN],
	responses={
		200: DOC_LIST_FRIENDSHIP_RESPONSE,
		401: DOC_ERROR_UNAUTHORIZED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
		500: DOC_ERROR_USERNAME
	})
@api_view(['GET'])
@permission_classes([IsNormalToken])
def friend_list(request):
	user_id = request.user.id
	friendship = Friendship.objects.filter(Q(user1=user_id) | Q(user2=user_id))
	try:
		serializer = FriendshipSerializer(friendship, many=True, context={'user_id': user_id})
		return Response({'message': MSG_LIST_FRIENDSHIP,
					'data': serializer.data}, status=status.HTTP_200_OK)
	except:
		return Response({'message': MSG_ERROR_USERNAME},
				status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@swagger_auto_schema(method='delete',
	manual_parameters=[JWT_TOKEN],
	responses={
		200: DOC_FRIENDSHIP_DELETE_RESPONSE,
		400: DOC_ERROR_RESPONSE,
		401: DOC_ERROR_UNAUTHORIZED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED
	})
@api_view(['DELETE'])
@permission_classes([IsNormalToken])
def remove_friend(request, friendship_id):
	user_id = request.user.id
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
