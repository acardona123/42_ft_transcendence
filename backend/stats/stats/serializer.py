from rest_framework import serializers
from .models import Statistics, UpdateStatistics

class StatisticsSerializer(serializers.ModelSerializer):

	class Meta:
		model = Statistics
		fields = ('player_id',)

	def validate(self, data):
		id_val = data.get('player_id')
		validate_id(id_val)
		id_exists = Statistics.objects.filter(player_id=id_val).exists()
		if id_exists:
			raise serializers.ValidationError("A Statistics object with this player_id already exists.")
		return data

class UpdateStatisticsSerializer(serializers.ModelSerializer):

	class Meta:
		model = UpdateStatistics
		fields = '__all__'

	def update_statistics(self, player1_stats, player2_stats, game, winner):
		print("update stats in the serializer update")
		if game == "flappy":
			player1_stats.total_flappy_matches += 1
			player2_stats.total_flappy_matches += 1
			if winner == player1_stats.player_id:
				player1_stats.total_flappy_victory += 1
			elif winner == player2_stats.player_id:
				player2_stats.total_flappy_victory += 1
		elif game == "pong":
			player1_stats.total_pong_matches += 1
			player2_stats.total_pong_matches += 1
			if winner == player1_stats.player_id:
				player1_stats.total_pong_victory += 1
			elif winner == player2_stats.player_id:
				player2_stats.total_pong_victory += 1

		print(player1_stats)
		print(player2_stats)

		player1_stats.save()
		player2_stats.save()

	def create(self, validated_data):
		player_id1 = validated_data.get('player_id1')
		player_id2 = validated_data.get('player_id2')
		game = validated_data.get('game')
		winner = validated_data.get('winner')

		player1_stats = Statistics.objects.get(player_id=player_id1)
		player2_stats = Statistics.objects.get(player_id=player_id2)

		self.update_statistics(player1_stats, player2_stats, game, winner)

		return player1_stats, player2_stats
	
	def	validate_player_id1(self, player_id1):
		print("valid the palyer 1")
		return validate_id(player_id1)
	
	def	validate_player_id2(self, player_id2):
		print("valid the palyer 2")
		return validate_id(player_id2)

	def validate(self, data):
		print("validate parent")

		if not all([data['game'], data['winner'], data['player_id1'], data['player_id2']]):
			raise serializers.ValidationError("Error: at least one field is missing")

		if data['winner'] not in [data['player_id1'], data['player_id2'], -1]:
			raise serializers.ValidationError("Winner must be one of the player IDs or -1 for a draw")

		return data

def validate_id(id):
	if (id < 0):
		raise serializers.ValidationError("An id can't be negative")
	return id
