from rest_framework.views import APIView
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from .models import CustomUser
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from .serializer import UserSerializer

class SignUp(APIView):
	@csrf_exempt
	def post(self, request):
		serializer = UserSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			data = {
				"message" : "User created",
				"data" : serializer.data
			}
			return Response(data, status=201)
		data = {
			"message" : "Error occured while creating user",
			"data" : serializer.errors
		}
		return Response(data, status=404)