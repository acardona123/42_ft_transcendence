from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# -----------------------SWAGGER(DOC)---------------------------

MSG_ERROR_UNIDENTIFIED_USER = 'can\'t access the historic without being identified as a player'
MSG_ERROR_JSON_FORMAT = 'Expecting a json body for creating a new match'

MSG_LIST_ERROR_SERIALIZER_DISPLAY = 'failed to display the matches history'
MSG_LIST_SUCCESS = 'matches history'
DOC_LIST_MATCHES = openapi.Response(
			description=MSG_LIST_SUCCESS,
			examples={
				"application/json": {
					"message": MSG_LIST_SUCCESS,
					"matches": [
						{
						"game": "FB",
						"date": "2024-10-15T17:18:12.666123Z",
						"duration": 150,
						"main_player_username": "username_id_7",
						"opponent_username": "username_id_3",
						"main_player_score": 15,
						"opponent_score": 7
						},
						{
						"game": "PG",
						"date": "2024-10-15T17:18:12.666104Z",
						"duration": 127,
						"main_player_username": "username_id_7",
						"opponent_username": "username_id_4",
						"main_player_score": 8,
						"opponent_score": 19
						}
					]
				}
			}
		)

MSG_NEW_MATCH_ERROR_MISSING_FIELD = 'match creation impossible: missing username or pin for the second player'
MSG_NEW_MATCH_ERROR_WRONG_PIN = 'match creation impossible: wrong pin for the second player'

MSG_FINISH_MATCH_ERROR_ID_NOT_FOUND = 'there is no match identified by the given id to be ended'
MSG_FINISH_MATCH_ERROR_NOT_ALLOWED = 'a match can be declared as finished only by its players or the creator of the tournament'
MSG_FINISH_MATCH_ERROR_ALREADY_FINISHED = 'the match was already finished'
MSG_FINISH_MATCH_ERROR_MISSING_FIELD = 'missing "score1" or "score2" or "duration" field to successfully end a match'

JWT_TOKEN = openapi.Parameter('Authentication : Bearer XXX',openapi.IN_HEADER,description="jwt access token", type=openapi.IN_HEADER, required=True)

def doc_error_generation(err_description, err_msg):
	return (openapi.Response(
				description="Error: " + err_description,
				examples={
					"application/json": {
						"message": err_msg
					}
				})
			)