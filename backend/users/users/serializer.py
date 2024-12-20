from rest_framework import serializers
from .models import CustomUser, ProfilePicture
from django.contrib.auth.password_validation import validate_password
from .doc import (MSG_ERROR_SER_INVALID_PASSWORD, MSG_ERROR_SER_PASSWORD_EMPTY,
			MSG_ERROR_SER_CURRENT_PASSWORD, MSG_ERROR_SER_NO_USER,
			MSG_ERROR_SER_USER_WITHOUT_PASSWORD, MSG_ERROR_SER_OLD_PASSWORD)
import re
import random

def validate_username(username):
	if re.match("^[A-Za-z0-9_-]*$", username):
		return username
	else:
		raise serializers.ValidationError("Username must contains only letters, digits, _ or -")

class UserSerializer(serializers.ModelSerializer):
	password2 = serializers.CharField(write_only=True, required=True)

	class Meta:
		model = CustomUser
		fields = ['email', 'phone', 'username', 'password', 'password2']
		extra_kwargs = {'password': {'write_only': True}}

	def validate_username(self, username):
		return validate_username(username)
	def validate(self, data):
		if data['password'] != data['password2']:
			raise serializers.ValidationError({"password": MSG_ERROR_SER_INVALID_PASSWORD})
		password = data.pop('password2', None)
		if password == None:
			raise serializers.ValidationError({"password": MSG_ERROR_SER_PASSWORD_EMPTY})
		user = CustomUser(**data)
		validate_password(password=password, user=user)
		return data

	def create(self, validated_data):
		password = validated_data.pop('password', None)
		username = validated_data.pop('username', None)
		user = CustomUser.objects.create_user(username, password, **validated_data)
		if user is None:
			raise serializers.ValidationError({"message": "Error while creating user"})
		return user

class OauthUserSerializer(serializers.ModelSerializer):
	image_url = serializers.URLField(source='profilepicture.oauth_profile_picture')

	class Meta:
		model = CustomUser
		fields = ['email', 'phone', 'username', 'oauth_id', 'image_url']

	def to_internal_value(self, data):
		if data.get('phone') == 'hidden':
			data.pop('phone')
		data['oauth_id'] = data.get('id', None)
		data['username'] = data.get('login', None)
		try:
			image = data['image']['versions']['small']
			data['image_url'] = image
		except:
			raise serializers.ValidationError({"image_url": "Missing image link in the info form oauth2.0"})
		if data['username'] is not None and CustomUser.objects.filter(username=data['username']).exists():
			data['username'] = self.unique_random_username(data['username'])
			self.change_username = True
		else:
			self.change_username = False
		return super(OauthUserSerializer, self).to_internal_value(data)
	
	def unique_random_username(self, login):
		while True:
			number = random.randint(0,9999)
			number = f"{number:04d}"
			username = login + '#' + number
			if not CustomUser.objects.filter(username=username).exists():
				break
		return username
	
	def validate_username(self, username):
		if self.change_username == False:
			validate_username(username)
		return username

	def create(self, validated_data):
		username = validated_data.pop('username', None)
		user = CustomUser.objects.create_user(username, **validated_data)
		if user is None:
			raise serializers.ValidationError({"message": "Error while creating user"})
		return user
	
class UpdatePasswordSerializer(serializers.ModelSerializer):
	password = serializers.CharField(write_only=True, required=True)
	password2 = serializers.CharField(write_only=True, required=True)
	old_password = serializers.CharField(write_only=True, required=True)

	class Meta:
		model = CustomUser
		fields = ['old_password', 'password', 'password2']
	
	def validate(self, data):
		if data.get('password') != data.get('password2'):
			raise serializers.ValidationError({"password": MSG_ERROR_SER_INVALID_PASSWORD})
		if data.get('old_password') == data.get('password'):
			raise serializers.ValidationError({"password": MSG_ERROR_SER_CURRENT_PASSWORD})
		user = self.context.get('user', None)
		validate_password(password=data.get('password'), user=user)
		return data

	def validate_old_password(self, old_password):
		user = self.context.get('user', None)
		if user is None:
			raise serializers.ValidationError(MSG_ERROR_SER_NO_USER)
		if not user.has_usable_password():
			raise serializers.ValidationError(MSG_ERROR_SER_USER_WITHOUT_PASSWORD)
		if not user.check_password(old_password):
			raise serializers.ValidationError(MSG_ERROR_SER_OLD_PASSWORD)
		return old_password

	def update(self, instance, validated_data):
		instance.set_password(validated_data['password'])
		instance.save()
		return instance

class UpdateUserSerializer(serializers.ModelSerializer):

	class Meta:
		model = CustomUser
		fields = ['username', 'email', 'phone', 'pin']

	def validate_username(self, username):
		return validate_username(username)
	
	def validate_pin(self, pin):
		if len(pin) > 4:
			raise serializers.ValidationError("Pin must contain only digits")
		for letter in pin:
			if letter not in {'0','1','2','3','4','5','6','7','8','9'}:
				raise serializers.ValidationError("Pin must contain only digits")
		pin = pin.zfill(4)
		return pin

class UpdateProfilePictureSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = ProfilePicture
		fields = ["profile_picture"]
		extra_kwargs = {'profile_picture': {'required': True}}
	
	def update(self, instance, validated_data):
		if instance.oauth_profile_picture != None:
			instance.oauth_profile_picture = None
		else:
			instance.remove_old_picture()
		instance.profile_picture = validated_data['profile_picture']
		instance.full_clean()
		instance.save()
		return instance
	
	def to_representation(self, data):
		res = super(UpdateProfilePictureSerializer, self).to_representation(data)
		res['profile_picture'] = "https://localhost:8443" + res['profile_picture']
		return res
	
class UserInfoSerializer(serializers.ModelSerializer):
	is_oauth = serializers.SerializerMethodField()
	profile_picture = serializers.SerializerMethodField()

	class Meta:
		model = CustomUser
		fields = ['username', 'email', 'phone', 'is_2fa_enable', 'pin', 'is_oauth', 'profile_picture']

	def get_is_oauth(self, obj):
		if obj.oauth_id == None:
			return False
		else:
			return True
	
	def get_profile_picture(self, obj):
		return obj.get_picture()

