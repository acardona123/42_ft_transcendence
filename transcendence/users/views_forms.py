from rest_framework.views import APIView
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from .models import CustomUser
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from .serializer import UserSerializer
from rest_framework import status

class SignUp(APIView):
	template_name = "signup.html"

	parser_classes = [JSONParser, MultiPartParser]
	def get(self, request):
		return render(request, self.template_name)

	@csrf_exempt
	def post(self, request):
		serializer = UserSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			print('serializer has been saved')
			return Response(serializer.data, status=status.HTTP_201_CREATED)
		print(serializer.errors)
		return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

from django.contrib.auth import update_session_auth_hash

# RetrieveUpdateAPIView generics.UpdateAPIView) ??
class UserProfileUpdateView(APIView):
	template_name = 'update-profile.html'
	def get(self, request):
		return render(request, self.template_name, {'user': request.user})

	# def post(self, request):
	# 	# serializer = UserSerializer(data=request.data)

