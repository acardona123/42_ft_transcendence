from django.views import generic
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from .models import CustomUser
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser

class SignUp(generic.View):
	template_name = "signup.html"

	def get(self, request):
		return render(request, self.template_name)

	def post(self, request):
		email = request.POST.get('email')
		pseudo = request.POST.get('pseudo')
		phone = request.POST.get('phone')
		password1 = request.POST.get('password1')
		password2 = request.POST.get('password2')
		profile_picture = request.FILES.get('profile_picture')

		if password1 != password2:
			return render(request, self.template_name, {'error': "Passwords don't match"})

		if not phone.isdigit():
			return render(request, self.template_name, {'error': "Phone number must contain only digits"})

		try:
			user = CustomUser(
				email=email,
				pseudo=pseudo,
				phone=phone,
				profile_picture=profile_picture,
				password=make_password(password1)
			)
			user.full_clean()
			user.save()
			return redirect('home')
		except ValidationError as e:
			return render(request, self.template_name, {'error': str(e)})


from django.contrib.auth import update_session_auth_hash

class UserProfileUpdateView(generic.View):
	template_name = 'update-profile.html'
	def get(self, request):
		return render(request, self.template_name, {'user': request.user})

	def post(self, request):
		user = request.user
		email = request.POST.get('email')
		pseudo = request.POST.get('pseudo')
		phone = request.POST.get('phone')
		profile_picture = request.FILES.get('profile_picture')
		password1 = request.POST.get('password1')
		password2 = request.POST.get('password2')

		if password1 or password2:
			if password1 != password2:
				return render(request, self.template_name, {'error': "Passwords don't match", 'user': user})
			user.password = make_password(password1)
			update_session_auth_hash(request, user)  # Keep the user logged in after password change

		if not phone.isdigit():
			return render(request, self.template_name, {'error': "Phone number must contain only digits", 'user': user})

		if email:
			user.email = email
		if pseudo:
			user.pseudo = pseudo
		if phone:
			user.phone = phone

		if profile_picture:
			user.profile_picture = profile_picture

		try:
			user.full_clean()  # Validate the model fields
			user.save()
			return redirect('home')
		except ValidationError as e:
			return render(request, self.template_name, {'error': str(e), 'user': user})
