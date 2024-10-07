from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework.exceptions import ErrorDetail
import json
from .models import CustomUser
from .utils import create_user_oauth

class TestRandomName(TestCase):
	def create_user(self, username, email=None, phone=None):
		data = dict()
		data['email'] = email
		data['phone'] = phone
		return CustomUser.objects.create_user(username, **data)

class UserManagment(TestCase):
	def setUp(self):
		self.client = APIClient()

	def create_user(self, username, password):
		payload = {
			"username" :username,
			"password" :password,
			"password2" :password
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")

	def create_user_oauth(self, username, email, phone, id_oauth):
		data = dict()
		data['email'] = email
		data['phone'] = phone
		data['oauth_id'] = id_oauth
		CustomUser.objects.create_user(username, **data)

	def test_signup(self):
		response = self.client.get(reverse('signup'), content_type= "application/json")
		self.assertEqual(response.status_code, 405)
		self.assertEqual(response.data,{'detail': ErrorDetail(string='Method "GET" not allowed.', code='method_not_allowed')})

		response = self.client.post(reverse('signup'), content_type= "application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data, {'message': 'Error occured while creating user', 'data': {'username': [ErrorDetail(string='This field is required.', code='required')], 'password': [ErrorDetail(string='This field is required.', code='required')], 'password2': [ErrorDetail(string='This field is required.', code='required')]}})

		payload = {
			"username" :"coucou"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data, {'message': 'Error occured while creating user', 'data': {'password': [ErrorDetail(string='This field is required.', code='required')], 'password2': [ErrorDetail(string='This field is required.', code='required')]}})

		payload = {
			"password" : "123asd456",
			"username" : "quentin"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data, {'message': 'Error occured while creating user', 'data': {'password2': [ErrorDetail(string='This field is required.', code='required')]}})

		payload = {
			"password" : "123asd456",
			"password2" : "123asd4561",
			"username" : "quentin"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data, {'message': 'Error occured while creating user', 'data': {'password': [ErrorDetail(string="Password fields didn't match", code='invalid')]}})

		payload = {
			"password" : "",
			"password2" : "",
			"username" : "quentin"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data, {'message': 'Error occured while creating user', 'data': {'password': [ErrorDetail(string='This field may not be blank.', code='blank')], 'password2': [ErrorDetail(string='This field may not be blank.', code='blank')]}})

		payload = {
			"password" : None,
			"password2" : None,
			"username" : "quentin"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data, {'message': 'Error occured while creating user', 'data': {'password': [ErrorDetail(string='This field may not be null.', code='null')], 'password2': [ErrorDetail(string='This field may not be null.', code='null')]}})

		payload = {
			"password" : "123",
			"password2" : "123",
			"username" : "quentin"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data, {'message': 'Error occured while creating user', 'data': {'non_field_errors': [ErrorDetail(string='This password is too short. It must contain at least 8 characters.', code='password_too_short'), ErrorDetail(string='This password is too common.', code='password_too_common'), ErrorDetail(string='This password is entirely numeric.', code='password_entirely_numeric')]}})

		payload = {
			"phone" : "+336582614",
			"password" : "123asd456",
			"email" : "a@gmail.com",
			"password2" : "123asd456",
			"username" : "quentin1"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data, {'message': 'Error occured while creating user', 'data': {'phone': [ErrorDetail(string='The phone number entered is not valid.', code='invalid')]}})

		payload = {
			"phone" : "+33659482614",
			"password" : "123asd456",
			"email" : "a@gmai",
			"password2" : "123asd456",
			"username" : "quentin1"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		print(reverse('signup'))
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data, {'message': 'Error occured while creating user', 'data': {'email': [ErrorDetail(string='Enter a valid email address.', code='invalid')]}})

		payload = {
			"password" : "123asd456",
			"email" : "a@gmai.com",
			"phone" : "",
			"password2" : "123asd456",
			"username" : "quentin1"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data, {'message': 'Error occured while creating user', 'data': {'phone': [ErrorDetail(string='This field may not be blank.', code='blank')]}})

		payload = {
			"phone" : "+33659482614",
			"password" : "",
			"email" : "a@gmai.com",
			"password2" : "123asd456",
			"username" : "quentin1"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data, {'message': 'Error occured while creating user', 'data': {'password': [ErrorDetail(string='This field may not be blank.', code='blank')]}})
		
		payload = {
			"phone" : "+33659482614",
			"password" : "123asd456",
			"email" : "",
			"password2" : "123asd456",
			"username" : "quentin1"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data, {'message': 'Error occured while creating user', 'data': {'email': [ErrorDetail(string='This field may not be blank.', code='blank')]}})

		payload = {
			"phone" : "+33659482614",
			"password" : "123asd456",
			"email" : "a@gmail.com",
			"password2" : "",
			"username" : "quentin1"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data, {'message': 'Error occured while creating user', 'data': {'password2': [ErrorDetail(string='This field may not be blank.', code='blank')]}})

		payload = {
			"phone" : "+33659248614",
			"password" : "123asd456",
			"email" : "a@gmail.com",
			"password2" : "123asd456",
			"username" : ""
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 400)
		self.assertEqual(response.data, {'message': 'Error occured while creating user', 'data': {'username': [ErrorDetail(string='This field may not be blank.', code='blank')]}})

		payload = {
			"password" : "123asd456",
			"password2" : "123asd456",
			"username" : "quentin"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 201)

		payload = {
			"phone" : "+33659482614",
			"password" : "123asd456",
			"password2" : "123asd456",
			"username" : "quentin1"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 201)

		payload = {
			"phone" : "+33659482614",
			"password" : "123asd456",
			"email" : "a@gmail.com",
			"password2" : "123asd456",
			"username" : "quentin12"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 201)

		payload = {
			"phone" : "+33659482614",
			"password" : "123asd456",
			"email" : "a@gmail.com",
			"password2" : "123asd456",
			"username" : "quentin12"
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 400)

		username, email, phone, id_oauth = ("hello", "hello@gmail.com", "+3659481723", 1235)
		self.create_user_oauth(username, email, phone, id_oauth)
		payload = {
			"phone" : phone,
			"password" : "123asd456",
			"email" : email,
			"password2" : "123asd456",
			"username" : username
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 400)

	def test_create_user_oauth(self):
		username, email, phone = ("hello", "hello@gmail.com", "+3659481723")
		payload = {
			"phone" : phone,
			"password" : "123asd456",
			"email" : email,
			"password2" : "123asd456",
			"username" : username
		}
		response = self.client.post(reverse('signup'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 201)
		payload = {
			"phone" : phone,
			"email" : email,
			"login" : username,
			"id" : 12347
		}
		user = create_user_oauth(payload)
		self.assertEqual(response.status_code, 201)

	def test_login(self):
		response = self.client.get(reverse('login_user'), content_type= "application/json")
		self.assertEqual(response.status_code, 405)

		response = self.client.post(reverse('login_user'), content_type= "application/json")
		self.assertEqual(response.status_code, 401)

		payload = {
			"username" :"coucou"
		}
		response = self.client.post(reverse('login_user'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 401)

		payload = {
			"password" :"123qwe456"
		}
		response = self.client.post(reverse('login_user'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 401)

		payload = {
			"username" :"coucou",
			"password" :"123qwe456"
		}
		response = self.client.post(reverse('login_user'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 401)

		payload = {
			"username" :"",
			"password" :""
		}
		response = self.client.post(reverse('login_user'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 401)

		payload = {
			"username" : None,
			"password" : None
		}
		response = self.client.post(reverse('login_user'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 401)

		username, password = ("hey", "123asd456")
		self.create_user(username, password)
		payload = {
			"username": username,
			"password": password
		}
		response = self.client.post(reverse('login_user'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 200)
		self.assertEqual(response.data["data"]["2fa_status"], "off")

		username, email, phone, id_oauth = ("hello", None, None, 1235)
		self.create_user_oauth(username, email, phone, id_oauth)
		payload = {
			"username": username,
			"password": None
		}
		response = self.client.post(reverse('login_user'), data=json.dumps(payload), content_type= "application/json")
		self.assertEqual(response.status_code, 401)
