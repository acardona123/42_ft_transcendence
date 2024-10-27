from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from .models import Statistics
from .serializer import StatisticsSerializer

@api_view(['GET'])
def get_user_stats(request, player_id):
	try:
		stats = Statistics.objects.get(player_id=player_id)
	except Statistics.DoesNotExist:
		return Response({"error": "Statistics not found for the given player_id"}, status=status.HTTP_404_NOT_FOUND)

	serializer = StatisticsSerializer(stats)
	json_data = JSONRenderer().render(serializer.data)
	print(json_data)
	return Response(serializer.data, status=status.HTTP_200_OK)
