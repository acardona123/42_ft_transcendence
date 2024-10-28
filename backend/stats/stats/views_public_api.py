from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from .models import Statistics
from .serializer import StatisticsSerializer, StatisticsPublicSerializer
from .authentication import IsNormalToken

@api_view(['GET'])
@permission_classes([IsNormalToken])
def get_user_stats(request):
	player_id = request.user.id
	try:
		stats = Statistics.objects.get(player_id=player_id)
	except Statistics.DoesNotExist:
		return Response({"error": "Statistics not found for the given player_id"}, status=status.HTTP_404_NOT_FOUND)

	serializer = StatisticsPublicSerializer(stats)
	json_data = JSONRenderer().render(serializer.data)
	print(json_data)
	return Response(serializer.data, status=status.HTTP_200_OK)
