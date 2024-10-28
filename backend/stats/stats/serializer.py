from rest_framework import serializers
from .models import Statistics, UpdateMatchStatistics

def validate_id(id):
	'''
	Check if the id is not negative
	
	Returns: True if exist in the database

	Raises:
   		serializers.ValidationError: If the player ID is negative
	'''
	if (id < 0):
		raise serializers.ValidationError("An id can't be negative")
	id_exists = Statistics.objects.filter(player_id=id).exists()
	return id_exists

def validate_a_player(player_id):
	'''
	Validates a player ID by checking if it is non-negative and exists in the Statistics database

	Returns: The player id

	Raises:
   		serializers.ValidationError: If the player ID is negative or does not exist in the Statistics database.
	'''
	print("beginiing of validate a player")
	if not validate_id(player_id):
		print("raise validate a player")
		raise serializers.ValidationError(f"The player id {player_id} doesn't exist in the db Statistics")
	return player_id

VALID_GAME_NAMES = {"flappy", "pong"}
def	validate_game_name(game):
	if game not in VALID_GAME_NAMES:
		raise serializers.ValidationError("The game name doesn't exist")
	return game
	
	

class StatisticsSerializer(serializers.ModelSerializer):

	class Meta:
		model = Statistics
		# fields = '__all__'
		fields = ('player_id',)

	def validate(self, data):
		id_val = data.get('player_id')
		validate_id(id_val)
		id_exists = Statistics.objects.filter(player_id=id_val).exists()
		if id_exists:
			raise serializers.ValidationError("A Statistics object with this player_id already exist.")
		return data

class StatisticsPublicSerializer(serializers.ModelSerializer):

	class Meta:
		model = Statistics
		fields = '__all__'

class UpdateMatchStatisticsSerializer(serializers.ModelSerializer):

	class Meta:
		model = UpdateMatchStatistics
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

		print("before get object")
		#rajouter try ou deja call par get ??
		try:
			stats = Statistics.objects.get(player_id=player_id2)
		except Statistics.DoesNotExist:
			raise serializers.ValidationError(f"Player id {player_id2} was not found")

		player1_stats = Statistics.objects.get(player_id=player_id1)
		player2_stats = Statistics.objects.get(player_id=player_id2)

		self.update_statistics(player1_stats, player2_stats, game, winner)
	
		return 0
		# return player1_stats, player2_stats

	def	validate_player_id1(self, player_id1):
		return validate_a_player(player_id1)
	
	def	validate_player_id2(self, player_id2):
		return validate_a_player(player_id2)

	def	validate_game(self, game):
		return validate_game_name(game)

	def validate(self, data):
		if not all([data['game'], data['winner'], data['player_id1'], data['player_id2']]):
			raise serializers.ValidationError("Error: at least one field is missing")

		if data['winner'] not in [data['player_id1'], data['player_id2'], -1]:
			raise serializers.ValidationError("Error: Winner must be one of the player IDs or -1 for a draw")

		return data

class UpdateTournamentStatisticsSerializer(serializers.Serializer):
	list_participants = serializers.ListField(
        child=serializers.IntegerField())
	game = serializers.CharField()
	winner = serializers.IntegerField()


	def create(self, validated_data):
		print("create")
		list_participants = validated_data.get('list_participants')
		game = validated_data.get('game')
		winner = validated_data.get('winner')

		self.update_tournament_stats(list_participants, winner, game)
		return 0

	def	validate_game(self, game):
		print("validate_game")
		return validate_game_name(game)
	
	def validate_list_participants(self, list_participants):
		print("validate_list_participants")
		for player_id in list_participants:
			print(f"participant : {player_id}")
			if not validate_id(player_id):
				print("raise error")
				raise serializers.ValidationError(f"Error: participant id [{player_id}] doesn't exist")
		print("list participants is good", list_participants)
		return list_participants

	def validate(self, data):
		print("validate")
		if data['winner'] not in data['list_participants']:
			raise serializers.ValidationError(f"Error: winner [{data['winner']}] is not in the list_participants ")
		return data

	def update_tournament_stats(self, list_participants, winner, game):
		if game == "flappy":
			self.update_flappy_tournament_stats(list_participants, winner)
		else:
			self.update_pong_tournament_stats(list_participants, winner)
	
	def update_flappy_tournament_stats(self, list_participants, winner):
		player_stats = Statistics.objects.get(player_id=winner)
		player_stats.total_flappy_tournament_victory += 1
		for player_id in list_participants:
			player_stats = Statistics.objects.get(player_id=player_id)
			player_stats.total_flappy_tournament_played += 1
			if (player_id == winner):
				player_stats.total_flappy_tournament_victory += 1
			player_stats.save()
			print(player_stats)
			
	def update_pong_tournament_stats(self, list_participants, winner):
		for player_id in list_participants:
			player_stats = Statistics.objects.get(player_id=player_id)
			player_stats.total_pong_tournament_played += 1
			if (player_id == winner):
				player_stats.total_pong_tournament_victory += 1
			player_stats.save()
			print(player_stats)
			

			


