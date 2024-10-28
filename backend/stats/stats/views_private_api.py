from .models import Statistics
from .serializer import StatisticsSerializer, UpdateMatchStatisticsSerializer, UpdateTournamentStatisticsSerializer
from rest_framework import status


from rest_framework.decorators import api_view
from rest_framework.response import Response

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema

DOC_ERROR_METHOD_NOT_ALLOWED = openapi.Response(
			description="Method Not Allowed",
			examples={
				"application/json": {
					"detail": "Method \"PUT\" not allowed."
					}
			}
		)

DOC_ERROR_BAD_REQUEST = openapi.Response(
			description="stats user not created",
			examples={
				"application/json": {
					"message": "stats user not created", 
					"data": "errors"
				}
			}
		)

DOC_USER_STATS_CREATED = openapi.Response(
			description="stats user created",
			examples={
				"application/json": {
					"message": "stats user created",
				}
			}
		)

@swagger_auto_schema(
	method='post',
	operation_description = "Create the User statistics in the data base",
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		properties={
			'player_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='input', example="1"),
		}
	),
	responses={
		201: DOC_USER_STATS_CREATED,
		400: DOC_ERROR_BAD_REQUEST,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
def create_statistics_user(request):
	serializer = StatisticsSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
		return Response({'message': "stats user created"}, status=status.HTTP_201_CREATED)
	else:
		return Response({'message': "stats user not created", 
				   		'data': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


DOC_ERROR_STATS_MATCH_NOT_UPDATED = openapi.Response(
			description="statistics match of the user were not updated",
			examples={
				"application/json": {
					"message": "statistics match of the user were not updated", 
					"data": "errors"
				}
			}
		)


DOC_USER_STATS_MATCH_UPDATED = openapi.Response(
			description="statistics match updated successfully",
			examples={
				"application/json": {
					"message": "statistics match updated successfully",
				}
			}
		)

@swagger_auto_schema(
	method='post',
	operation_description = "Updat User statistics related to the matches in the data base",
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		properties={
			'player_1': openapi.Schema(type=openapi.TYPE_INTEGER, description='input', example="1"),
			'player_2': openapi.Schema(type=openapi.TYPE_INTEGER, description='input', example="2"),
			'game': openapi.Schema(type=openapi.TYPE_STRING, description='input', example="FB"),
			'winner': openapi.Schema(type=openapi.TYPE_INTEGER, description='input', example="2")
		}
	),
	responses={
		201: DOC_USER_STATS_MATCH_UPDATED,
		400: DOC_ERROR_STATS_MATCH_NOT_UPDATED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
def generate_match_data_stats(request):
	serializer = UpdateMatchStatisticsSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
		return Response({"message": "Statistics  match updated successfully",
				   		"data": serializer.errors}
						, status=status.HTTP_200_OK)
	else:
		return Response({"message": "statistics match were not updated",
				   		 "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


DOC_ERROR_STATS_TOURNAMENT_NOT_UPDATED = openapi.Response(
			description="statistics tournament of the user were not updated",
			examples={
				"application/json": {
					"message": "statistics tournament of the users were not updated", 
					"data": "errors"
				}
			}
		)


DOC_USER_STATS_TOURNAMENT_UPDATED = openapi.Response(
			description="statistics tournament updated successfully",
			examples={
				"application/json": {
					"message": "statistics tournament updated successfully",
					"data": "errors"
				}
			}
		)

@swagger_auto_schema(
	method='post',
	operation_description = "Update Users statistics related to the tournaments in the data base",
	request_body=openapi.Schema(
		type=openapi.TYPE_OBJECT,
		properties={
			'list_participants': openapi.Schema(
			type=openapi.TYPE_ARRAY,
			description='input',
			items=openapi.Items(type=openapi.TYPE_INTEGER),
			example=[1, 2, 3]),
			'winner': openapi.Schema(type=openapi.TYPE_INTEGER, description='input', example="2"),
			'game': openapi.Schema(type=openapi.TYPE_STRING, description='input', example="PG"),
		}
	),
	responses={
		201: DOC_USER_STATS_TOURNAMENT_UPDATED,
		400: DOC_ERROR_STATS_TOURNAMENT_NOT_UPDATED,
		405: DOC_ERROR_METHOD_NOT_ALLOWED,
	})
@api_view(['POST'])
def generate_tournament_data_stats(request):
	serializer = UpdateTournamentStatisticsSerializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
		return Response({"message": "Statistics tournament updated successfully"}, status=status.HTTP_200_OK)
	else:
		return Response({"message": "statistics tournament of the users were not updated",
				   		 "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)