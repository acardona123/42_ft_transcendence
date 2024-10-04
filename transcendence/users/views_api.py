from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from .serializer import UserSerializer, UserPublicSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.http import FileResponse
import os

# -----------------------SWAGGER(DOC)---------------------------
MSG_ERROR_NO_USER_ID = 'User ID not provided'
MSG_ERROR_NO_USER = 'No User'
MSG_ERROR_USER_DOES_NOT_EXIST = 'User does not exist'
MSG_ERROR_NO_PROFILE_PICTURE = 'No profile picture'

@swagger_auto_schema(method='get',
	manual_parameters=[
		openapi.Parameter('username', openapi.IN_QUERY, description="Username to filter by", type=openapi.TYPE_STRING)
	],
	responses={200: UserPublicSerializer(many=True)
	})
@api_view(['GET'])
def get_users(request):
	users = CustomUser.objects.all()
	serializer = UserPublicSerializer(users, many = True)
	return Response(serializer.data)


# @swagger_auto_schema(method='get',
# 	type=openapi.TYPE
# )
@api_view(['GET', 'POST'])
def user_detail(request, id):
	try:
		user = CustomUser.objects.get(pk=id)
	except CustomUser.DoesNotExist:
		return Response({'message': MSG_ERROR_NO_USER_ID},
			status=status.HTTP_404_NOT_FOUND)
	if request.method == 'GET':
		serializer = UserSerializer(user)
		return Response(serializer.data)

@api_view(['GET'])
def	get_user_id(request, username):
	try:
		user = CustomUser.objects.get(username=username)
		return Response({'id': user.id}, status=status.HTTP_200_OK)
	except CustomUser.DoesNotExist:
		return Response({'message': MSG_ERROR_NO_USER}, status=status.HTTP_204_NO_CONTENT)
	
@api_view(['GET'])
def get_user_profile_picture(request, id):
	try:
		user = CustomUser.objects.get(pk=id)
	except CustomUser.DoesNotExist:
		return Response({'message': MSG_ERROR_USER_DOES_NOT_EXIST},
			status=status.HTTP_404_NOT_FOUND)
	if user.profile_picture:
		file_path = user.profile_picture.path
		try:
			f = open(file_path, 'rb')
			return FileResponse(f)
		except PermissionError:
			return Response({'message': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
		except FileNotFoundError:
			return Response({'message': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
	else:
		return Response({'message': MSG_ERROR_NO_PROFILE_PICTURE}, status=status.HTTP_204_NO_CONTENT)
