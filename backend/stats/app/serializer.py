from rest_framework import serializers
from models import statistics


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
	def __init__(self, *args, **kwargs):
		fields = kwargs.pop('fields', None)

		super().__init__(*args, **kwargs)

		if fields is not None:
			allowed = set(fields)
			existing = set(self.fields)
			for field_name in existing - allowed:
				self.fields.pop(field_name)

class StatisticsSerializer(DynamicFieldsModelSerializer):

	class Meta:
		model =statistics
		fields = ['id', 'total_victory_flappy', 'total_victory_pong', 'total_matches_flappy', 'total_matches_pong']

	# def __init__(self, *args, **kwargs):
	# 	super().__init__(*args, **kwargs)

