from rest_framework import serializers
from .models import CustomUser
import django.contrib.auth.password_validation as validators

class UserSerializer(serializers.ModelSerializer):
	password2 = serializers.CharField(write_only=True, required=True)

	class Meta:
		model = CustomUser
		fields = ['id', 'email', 'phone', 'username', 'password', 'password2']
		extra_kwargs = {'password': {'write_only': True}}

	def validate(self, data):
		if data['password'] != data['password2']:
			raise serializers.ValidationError({"Error": "Password fields didn't match."})
		password = data.pop('password2', None)
		if password == None:
			raise serializers.ValidationError({"Error": "Password fields empty."})
		user = CustomUser(**data)
		validators.validate_password(password=password, user=user)
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
		extra_kwargs = {'password': {'write_only': True}}

	def to_internal_value(self, data):
		if data.get('phone') == 'hidden':
			data.pop('phone')
		data['username'] = data.get('login', None)
		data['oauth_id'] = data.get('id', None)
		return super(OauthUserSerializer, self).to_internal_value(data)

	def create(self, validated_data):
		username = validated_data.pop('username', None)
		user = CustomUser.objects.create_user(username, **validated_data)
		return user
