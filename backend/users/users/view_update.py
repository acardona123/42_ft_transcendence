from .authentication import IsNormalToken
from .serializer import UpdatePasswordSerializer, UpdateUserSerializer, UpdateProfilPictureSerializer
# from .models import ProfilePicture
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .doc import (JWT_TOKEN, MSG_ERROR_UPDATE_PASSWORD_OAUTH,
		MSG_ERROR_UPDATE_PASSWORD, MSG_ERROR_UPDATE_USER_INFO,
		MSG_PASSWORD_UPDATE, MSG_USER_INFO, MSG_INFO_USER_UPDATE,
		MSG_PICTURE_URL, MSG_ERROR_NO_IMAGE, MSG_UPDATE_PICTURE,
		MSG_ERROR_UPDATING_IMAGE, DOC_IMAGE_URL, DOC_ERROR_NO_IMAGE,
		DOC_IMAGE_UPDATED, DOC_ERROR_UPADTE_IMAGE,
		DOC_ERROR_UPDATE_PASSWORD, DOC_IMPOSSIBLE_UPDATE_PASSWORD,
		DOC_UPDATE_PASSWORD, DOC_ERROR_UPDATE_INFO, DOC_UPDATE_INFO,
		DOC_ERROR_UNAUTHORIZED, DOC_ERROR_METHOD_NOT_ALLOWED)

@swagger_auto_schema(method='put',
	manual_parameters=[JWT_TOKEN],
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		required=['password', 'password2', 'old_password'],
		properties={
			'password': openapi.Schema(type=openapi.TYPE_STRING),
			'password2': openapi.Schema(type=openapi.TYPE_STRING),
			'old_password': openapi.Schema(type=openapi.TYPE_STRING),
		}
	),
	responses={
		200: DOC_UPDATE_PASSWORD,
		400: DOC_IMPOSSIBLE_UPDATE_PASSWORD,
		'400bis': DOC_ERROR_UPDATE_PASSWORD,
		401: DOC_ERROR_UNAUTHORIZED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['PUT'])
@permission_classes([IsNormalToken])
def update_password(request):
	if request.user.oauth_id is not None:
		return Response({"message": MSG_ERROR_UPDATE_PASSWORD_OAUTH}, status=400)
	serializer = UpdatePasswordSerializer(request.user, data=request.data, context={'user': request.user})
	if serializer.is_valid():
		serializer.save()
		return Response({"message" : MSG_PASSWORD_UPDATE}, status=200)
	data = {
		"message" : MSG_ERROR_UPDATE_PASSWORD,
		"data" : serializer.errors
	}
	return Response(data, status=400)

class UpdateUserInfo(APIView):
	permission_classes = [IsNormalToken]

	@swagger_auto_schema(
		manual_parameters=[JWT_TOKEN],
		request_body=openapi.Schema(
			type=openapi.TYPE_OBJECT,
			required=['username', 'email', 'phone', 'pin'],
			properties={
				'username': openapi.Schema(type=openapi.TYPE_STRING),
				'email': openapi.Schema(type=openapi.TYPE_STRING),
				'phone': openapi.Schema(type=openapi.TYPE_STRING),
				'pin': openapi.Schema(type=openapi.TYPE_STRING),
			}
		),
		responses={
			200: DOC_UPDATE_INFO,
			400: DOC_ERROR_UPDATE_INFO,
			401: DOC_ERROR_UNAUTHORIZED,
			405: DOC_ERROR_METHOD_NOT_ALLOWED,
		})
	def put(self, request):
		serializer = UpdateUserSerializer(request.user, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response({"message": MSG_INFO_USER_UPDATE,
							"data": serializer.data}, status=200)
		data = {
			"message" : MSG_ERROR_UPDATE_USER_INFO,
			"data" : serializer.errors
		}
		return Response(data, status=400)
	
	@swagger_auto_schema(
		manual_parameters=[JWT_TOKEN],
		responses={
			200: DOC_UPDATE_INFO,
			401: DOC_ERROR_UNAUTHORIZED,
			405: DOC_ERROR_METHOD_NOT_ALLOWED,
		})
	def get(self, request):
		serializer = UpdateUserSerializer(request.user)
		return Response({"message": MSG_USER_INFO,
						"data": serializer.data})

from rest_framework.parsers import MultiPartParser, FormParser

class UpdateProfilePicture(APIView):
	permission_classes = [IsNormalToken]
	parser_classes = [MultiPartParser, FormParser]

	@swagger_auto_schema(
		manual_parameters=[JWT_TOKEN,
			openapi.Parameter('profile_picture', openapi.IN_FORM, type=openapi.TYPE_FILE, description='Picture to be uploaded, only jpeg, jpg, png')],
		responses={
			200: DOC_IMAGE_UPDATED,
			400: DOC_ERROR_UPADTE_IMAGE,
			401: DOC_ERROR_UNAUTHORIZED,
			404: DOC_ERROR_NO_IMAGE,
			405: DOC_ERROR_METHOD_NOT_ALLOWED,
		})
	def put(self, request):
		user = request.user
		if not (hasattr(user, 'profilepicture') and user.profilepicture):
			return Response({'message': MSG_ERROR_NO_IMAGE}, status=404)
		serializer = UpdateProfilPictureSerializer(user.profilepicture, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response({"message": MSG_UPDATE_PICTURE,
							"data": serializer.data}, status=200)
		else:
			return Response({"message": MSG_ERROR_UPDATING_IMAGE,
							"data": serializer.errors}, status=400)

	@swagger_auto_schema(
		manual_parameters=[JWT_TOKEN],
		responses={
			200: DOC_IMAGE_URL,
			401: DOC_ERROR_UNAUTHORIZED,
			404: DOC_ERROR_NO_IMAGE,
			405: DOC_ERROR_METHOD_NOT_ALLOWED,
		})
	def get(self, request):
		user = request.user
		picture = user.get_picture()
		if picture == None:
			return Response({'message': MSG_ERROR_NO_IMAGE}, status=404)
		else:
			return Response({"message": MSG_PICTURE_URL,
							"data": picture}, status=200)