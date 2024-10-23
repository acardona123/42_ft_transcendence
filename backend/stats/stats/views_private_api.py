from .models import statistics
from .serializer import StatisticsSerializer

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

#creation des donnee des la creation du user et ensuite update pour les autres?

#microservice match doit m'envoyer les donnees d'un match lorsqu'il est fini
'''
{
	"player_id1" : "1",
	"player_id2" : "2",
	"game" : "flappy",
	"winner" : "2" et si egalite mettre -1
}
match me post ces donnes 
'''
# class updator:
# 	id = IntegerField
# 	total_flappy_matches = IntegerField(default=0)
# 	total_pong_matches = IntegerField(default=0)
# 	total_flappy_victory = IntegerField(default=0)
# 	total_pong_victory = IntegerField(default=0)

@api_view(['POST'])
def generate_match_data_stats(request):
    data = request.data
    print("test")
    player_id1 = data.get("player_id1")
    player_id2 = data.get("player_id2")
    game = data.get("game")
    winner = data.get("winner")
    print(player_id1)
    print(player_id2)
    print(winner)
    print(game)

    # player1_stats = get_object_or_404(statistics, id=player_id1)
    # player2_stats = get_object_or_404(statistics, id=player_id2)

    # serializer = StatisticsSerializer()
    # serializer.update_statistics(player1_stats, player2_stats, game, winner)

    return Response({"message": "Statistics updated successfully"})
