from .models import Statistics
from .serializer import StatisticsSerializer, UpdateMatchStatisticsSerializer, UpdateTournamentStatisticsSerializer
# from .views import update_statistics
from rest_framework import status


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
	serializer = UpdateMatchStatisticsSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
		return Response({"message": "Statistics  match updated successfully"}, status=status.HTTP_200_OK)
	else:
		return Response({"message": "Data to update match statistics are incorrect"}, status=status.HTTP_400_BAD_REQUEST)


#function pour update les statistiques des tournois, a appeler lors de la fin d'un tournoi par le microservice tournoi

'''
{
	"list_participants" : [1, 2, 3, 4],
	"winner" : "2"
}
'''

@api_view(['POST'])
def generate_tournament_data_stats(request):
	print("test")
	serializer = UpdateTournamentStatisticsSerializer(data=request.data)
	print("test1")
	if serializer.is_valid():
		print("test2")
		serializer.save()
		return Response({"message": "Statistics tournament updated successfully"}, status=status.HTTP_200_OK)
	else:
		print("test3")
		return Response({"message": "Data to update tournament statistics are incorrect"}, status=status.HTTP_400_BAD_REQUEST)