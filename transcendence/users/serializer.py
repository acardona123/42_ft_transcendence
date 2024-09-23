from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
	password1 = serializers.CharField(write_only=True, max_length=80)
	class Meta:
		model = CustomUser
		fields = ('id', 'password', 'password1', 'username', 'email', 'phone')
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
	

	# def to_representation(self, instance):
	# 	"""Override to_representation to exclude password1 from the output."""
	# 	representation = super().to_representation(instance)
	# 	representation.pop('password1', None)  # Remove password1 from the output
	# 	return representation