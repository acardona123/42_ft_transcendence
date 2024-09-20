from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
	password1 = serializers.CharField(max_length=80)
	class Meta:
		model = CustomUser
		fields = '__all__'
		extra_kwargs = {'password': {'write_only': True}}
	def create(self, validated_data):
		print('hey')
		if validated_data.get('password') != validated_data.get('password1'):
			raise ValueError("The pasword is not the same")
		print(validated_data.get('password'))
		print(validated_data)
		# validated_data.pop('password1')
		validated_data.pop('password')
		validated_data.pop('email')
		# validated_data.pop('username')
		print(validated_data)
		user = CustomUser.objects.create_user('rrrrr', 'eameee', **validated_data)
		return user