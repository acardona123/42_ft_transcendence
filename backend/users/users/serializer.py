from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
from .doc import (MSG_ERROR_SER_INVALID_PASSWORD, MSG_ERROR_SER_PASSWORD_EMPTY,
			MSG_ERROR_SER_CURRENT_PASSWORD, MSG_ERROR_SER_NO_USER,
			MSG_ERROR_SER_USER_WITHOUT_PASSWORD, MSG_ERROR_SER_OLD_PASSWORD)

class UserSerializer(serializers.ModelSerializer):
	password2 = serializers.CharField(write_only=True, required=True)

	class Meta:
		model = CustomUser
		fields = ['id', 'email', 'phone', 'username', 'password', 'password2']
		extra_kwargs = {'password': {'write_only': True}}

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
		return user

class OauthUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ['id', 'email', 'phone', 'username', 'oauth_id']
		# extra_kwargs = {'password': {'write_only': True}}

	def to_internal_value(self, data):
		if data.get('phone') == 'hidden':
			data.pop('phone')
		data['oauth_id'] = data.get('id', None)
		data['username'] = data.get('login', None)
		return super(OauthUserSerializer, self).to_internal_value(data)

	def create(self, validated_data):
		username = validated_data.pop('username', None)
		user = CustomUser.objects.create_user(username, **validated_data)
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
			raise serializers.ValidationError({"Error": MSG_ERROR_SER_NO_USER})
		if not user.has_usable_password():
			raise serializers.ValidationError({"Error": MSG_ERROR_SER_USER_WITHOUT_PASSWORD})
		if not user.check_password(old_password):
			raise serializers.ValidationError({"Error": MSG_ERROR_SER_OLD_PASSWORD})
		return old_password

	def update(self, instance, validated_data):
		instance.set_password(validated_data['password'])
		instance.save()
		return instance

class UpdateUserSerializer(serializers.ModelSerializer):

	class Meta:
		model = CustomUser
		fields = ['username', 'email', 'phone']
