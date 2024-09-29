from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser
from .serializer import UserSerializer, UserPublicSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# -----------------------SWAGGER(DOC)---------------------------
MSG_ERROR_NO_USER_ID_BODY = 'User ID not provide'

@api_view(['GET'])
def get_users(request):
	users = CustomUser.objects.all()
	serializer = UserPublicSerializer(users, many = True)
	return Response(serializer.data)
	
@api_view(['GET', 'POST'])
def user_detail(request, pk):
	try:
		user = CustomUser.objects.get(pk=pk)
	except CustomUser.DoesNotExist:
		return Response({'message': MSG_ERROR_NO_USERNAME_BODY},
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
		return Response 