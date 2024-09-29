from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):

	password1 = serializers.CharField(write_only=True, max_length=80)
	profile_picture = serializers.ImageField(required=False)

	class Meta:
		model = CustomUser
		fields = ('id', 'password', 'password1', 'username', 'email', 'phone', 'profile_picture')
		extra_kwargs = {
			'password': {'write_only': True}
			}

	def validate(self, data):
		if data['password'] != data['password1']:
			raise serializers.ValidationError("Passwords do not match.")
		validate_password(data['password'])
		return data

	def create(self, validated_data):
		print(validated_data)
		validated_data.pop('password1')
		print(validated_data)
		user = CustomUser.objects.create_user(**validated_data)
		return user
	

	def to_representation(self, instance):
			representation = super().to_representation(instance)
			if instance.profile_picture:
				representation['profile_picture'] = instance.profile_picture.url
			return representation


class UserPublicSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ('id', 'username')