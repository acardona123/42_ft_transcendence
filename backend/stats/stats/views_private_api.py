from .models import Statistics
from .serializer import StatisticsSerializer
# from .views import update_statistics
from rest_framework import status


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
@api_view(['POST'])
def create_statistics_user(request):
	print(request.data)
	serializer = StatisticsSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
		return Response({'message': "stats user created"}, status=status.HTTP_201_CREATED)
	else:
		print(serializer.errors)
		return Response({'message': "stats user not created"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def generate_match_data_stats(request):
	data = request.data
	game = data.get("game")
	winner = data.get("winner")
	player_id1 = data.get("player_id1")
	player_id2 = data.get("player_id2")

	if not all([game, winner, player_id1, player_id2]):
		return Response({"message": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

	player1_stats =	Statistics.objects.get(player_id=player_id1)
	player2_stats =	Statistics.objects.get(player_id=player_id2)

	if not player1_stats or not player2_stats:
		return Response({"message": "ID player doesn t exist"}, status=status.HTTP_400_BAD_REQUEST)
	update_statistics_match(player1_stats, player2_stats, game, winner)

	print(player1_stats)
	print(player2_stats)
	return Response({"message": "Statistics updated successfully"}, status=status.HTTP_200_OK)

def update_statistics_match(player1_stats, player2_stats, game, winner):
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


# @api_view(['POST'])
# def 


# Response({"message": MSG_ERROR_USER_ID_REQUIRED}, status=400)

# return Response({'message': MSG_ID_USERNAME,
# 			'data': {'id': user.id}}, status=200)