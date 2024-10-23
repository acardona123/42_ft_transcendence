from rest_framework import serializers
from .models import statistics

from rest_framework import serializers
from .models import statistics

class StatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = statistics
        fields = '__all__'

    def update_statistics(self, player1_stats, player2_stats, game, winner):
        if game == "flappy":
            player1_stats.total_flappy_matches += 1
            player2_stats.total_flappy_matches += 1
            if winner == str(player1_stats.id):
                player1_stats.total_flappy_victory += 1
            elif winner == str(player2_stats.id):
                player2_stats.total_flappy_victory += 1
        elif game == "pong":
            player1_stats.total_pong_matches += 1
            player2_stats.total_pong_matches += 1
            if winner == str(player1_stats.id):
                player1_stats.total_pong_victory += 1
            elif winner == str(player2_stats.id):
                player2_stats.total_pong_victory += 1

        player1_stats.save()
        player2_stats.save()