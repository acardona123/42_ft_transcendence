from rest_framework import serializers
from .models import Statistics

class StatisticsSerializer(serializers.ModelSerializer):

	class Meta:
		model = Statistics
		fields = ('player_id',)

	def validate(self, data):
		print("went to funtion validate")
		id_val = data.get('player_id')
		id_exists = Statistics.objects.filter(player_id=id_val).exists()
		if id_exists:
			print("Object already exist")
			raise serializers.ValidationError("A Statistics object with this player_id already exists.")
		print("validate went well")
		return data
