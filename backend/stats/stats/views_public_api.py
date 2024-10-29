from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Statistics
from .serializer import StatisticsSerializer, StatisticsPublicSerializer
from .authentication import IsNormalToken
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

JWT_TOKEN = openapi.Parameter('Authentication : Bearer XXX',openapi.IN_HEADER,description="jwt access token", type=openapi.IN_HEADER, required=True)

DOC_ERROR_UNAUTHORIZED = openapi.Response(
			description="Unauthorized to access the page, need to have jwt",
			examples={
				"application/json": {
					"detail": "Given token not valid for any token type",
					"code": "token_not_valid",
					"messages": [
						{
						"token_class": "AccessToken",
						"token_type": "access",
						"message": "Token is invalid or expired"
						}
					]
				}
			}
		)

DOC_ERROR_METHOD_NOT_ALLOWED = openapi.Response(
			description="Method Not Allowed",
			examples={
				"application/json": {
					"detail": "Method \"PUT\" not allowed."
					}
			}
		)

DOC_ERROR_PLAYER_NOT_FOUND = openapi.Response(
			description="Statistics not found for the given player_id",
			examples={
				"application/json": {
					"message": "Statistics not found for the given player_id"
					}
			}
		)

DOC_OK = openapi.Response(
			description="Retrieve user stats",
			examples={
				"application/json": {
					"message": "Retrieve user stats",
					 "data": {
						"id": 1,
						"player_id": 2,
						"total_flappy_matches": 0,
						"total_pong_matches": 0,
						"total_flappy_victory": 0,
						"total_pong_victory": 0,
						"total_flappy_tournament_victory": 0,
						"total_flappy_tournament_played": 0,
						"total_pong_tournament_victory": 0,
						"total_pong_tournament_played": 0
					}
				}
			}
		)

@swagger_auto_schema(method='get',
	manual_parameters=[JWT_TOKEN],
	responses={
		200: DOC_OK,
		401: DOC_ERROR_UNAUTHORIZED,
		404: DOC_ERROR_PLAYER_NOT_FOUND,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['GET'])
@permission_classes([IsNormalToken])
def get_user_stats(request):
	player_id = request.user.id
	try:
		stats = Statistics.objects.get(player_id=player_id)
	except Statistics.DoesNotExist:
		return Response({"message": "Statistics not found for the given player_id"}, status=status.HTTP_404_NOT_FOUND)

	serializer = StatisticsPublicSerializer(stats)
	return Response({"message": "Retrieve user stats", "data": serializer.data}, status=status.HTTP_200_OK)
