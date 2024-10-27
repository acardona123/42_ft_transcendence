MSG_ERROR_TOURNAMENT_ID_REQUIRED = "The field 'tournament_id' is required"
MSG_ERROR_USERNAME_PIN_REQUIRED = "The fields 'username' and 'pin' are required"
MSG_ERROR_SCORE_REQUIRED = "The fields 'score1' and 'score2' are required"
MSG_ERROR_PLAYER_REQUIRED = "The field 'player_id' is required"
MSG_INVALID_CREDS = "Incorrect username or pin"
MSG_INVALID_PLAYER = "Invalid player id"
MSG_ERROR_INVALID_TOURNAMENT_ID = "Invalid tournament id"
MSG_ERROR_CREATE_TOURNAMENT = "Fail to create tournament"
MSG_ERROR_PLAYER_TRN = 'Player already in the tournament'
MSG_ERROR_PLAYER_TRN_FAIL = "Failed to add the player to the tournament"
MSG_ERROR_REOMVE_HOST = "Impossible to remove host from the tournament"
MSG_ERROR_TRN = "Error while updating tournaments settings"
MSG_ERROR_USERNAME = "Error while retrieving username"
MSG_ERROR_MATCH = "Error while creating match"
MSG_ERROR_PLAYER = "Players are already playing"
MSG_ERROR_PLAYER_NOT_PLAYING = "Players are not playing, match can't be finished"
MSG_ERROR_NO_PLAYER_FOUND = "No player found to play this match"

MSG_TOUNAMENT_CREATED = "Tournament created, host added to the tournament"
MSG_PLAYER_ADD = "Player added to the tournament"
MSG_REVOME_PLAYER = "Player removed from the tournament"
MSG_TRN_VALIDE = "Tournament info validated"
MSG_GUEST_USERNAME = 'Guests username'
MSG_MATCH = "Matches in a round"
MSG_CREATE_MATCH = "Match created"
MSG_ROUND_FINISH = "Round finished"
MSG_MATCH_TIE = "Match tie, need to be replayed"
MSG_MATCH_FINISH = "Match finished"

#--------------------DOC--------------------
from drf_yasg import openapi

DOC_ERROR_METHOD_NOT_ALLOWED = openapi.Response(
			description="Method Not Allowed",
			examples={
				"application/json": {
					"detail": "Method \"PUT\" not allowed."
					}
			}
		)

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

JWT_TOKEN = openapi.Parameter('Authentication : Bearer XXX',openapi.IN_HEADER,description="jwt access token", type=openapi.IN_HEADER, required=True)

PLAYER = openapi.Parameter('player_id', openapi.IN_QUERY,
							description="id of the player to be remove",
							type=openapi.TYPE_STRING)

HOST = openapi.Parameter('host_id', openapi.IN_QUERY,
							description="id of the host user",
							type=openapi.TYPE_STRING)

TOURNAMENT = openapi.Parameter('tournament_id', openapi.IN_QUERY,
							description="Id of the tournament to be manipulated",
							type=openapi.TYPE_STRING)

DOC_CREATE_TRN = openapi.Response(
			description=MSG_TOUNAMENT_CREATED,
			examples={
				"application/json": {"message": MSG_TOUNAMENT_CREATED,
					"data": {"tournament_id": 89}}
			}
		)

DOC_ERROR_CREATE_TRN = openapi.Response(
			description=MSG_ERROR_CREATE_TOURNAMENT,
			examples={"application/json": {"message": MSG_ERROR_CREATE_TOURNAMENT}}
		)

DOC_ERROR_USERNAME_PIN = openapi.Response(
			description=MSG_ERROR_USERNAME_PIN_REQUIRED+' or '+MSG_INVALID_CREDS,
			examples={"application/json": {"message": MSG_ERROR_USERNAME_PIN_REQUIRED}}
		)

DOC_ERROR_TRN_ID = openapi.Response(
			description=MSG_ERROR_TOURNAMENT_ID_REQUIRED+' or '+MSG_ERROR_INVALID_TOURNAMENT_ID,
			examples={"application/json": {"message": MSG_ERROR_INVALID_TOURNAMENT_ID}}
		)

DOC_PLAYER_ALREADY_TRN = openapi.Response(
			description=MSG_ERROR_PLAYER_TRN,
			examples={"application/json": {'message': MSG_ERROR_PLAYER_TRN,
				"data": {"username": "coucou", "player_id": 4989}}}
		)

DOC_PLAYER_TRN = openapi.Response(
			description=MSG_PLAYER_ADD,
			examples={"application/json": {'message': MSG_PLAYER_ADD,
				"data": {"username": "coucou", "player_id": 4989}}}
		)

DOC_ERROR_ADD_PLAYER = openapi.Response(
			description=MSG_ERROR_PLAYER_TRN_FAIL,
			examples={"application/json": {"message": MSG_ERROR_PLAYER_TRN_FAIL}}
		)

DOC_ERROR_PLAYER_REQUIRED = openapi.Response(
			description=MSG_ERROR_PLAYER_REQUIRED+' or '+MSG_INVALID_PLAYER,
			examples={"application/json": {"message": MSG_ERROR_PLAYER_REQUIRED}}
		)

DOC_ERROR_REMOVE_HOST = openapi.Response(
			description=MSG_ERROR_REOMVE_HOST,
			examples={"application/json": {"message": MSG_ERROR_REOMVE_HOST}}
		)

DOC_REMOVE_PLAYER = openapi.Response(
			description=MSG_REVOME_PLAYER,
			examples={"application/json": {"message": MSG_REVOME_PLAYER,
						"data": {"player_id": 45}}}
		)

DOC_TRN_VALIDATE = openapi.Response(
			description=MSG_TRN_VALIDE,
			examples={"application/json": {"message": MSG_TRN_VALIDE}}
		)

DOC_ERROR_TRN_VALID = openapi.Response(
			description=MSG_ERROR_TRN+" in data you can have an error on each fields pass in the input or 'no_input_fields'",
			examples={"application/json": {"message": MSG_ERROR_TRN,
				"data": {'game': "Invalid game",
					'max_score': "not a number"}}}
		)

DOC_ERROR_USERNAME = openapi.Response(
			description=MSG_ERROR_USERNAME,
			examples={"application/json": {"message": MSG_ERROR_USERNAME}}
		)

DOC_GUEST = openapi.Response(
			description=MSG_GUEST_USERNAME,
			examples={"application/json": {'message': MSG_GUEST_USERNAME,
				'data': ["coucou", 'hey', 'comment']}}
		)

DOC_MATCH = openapi.Response(
			description=MSG_MATCH,
			examples={"application/json": {"message": MSG_MATCH,
					'data': {'matches': [['player1', 'player2'],
										['player3', 'player4'],
										['player5']]}}}
	)

DOC_ROUND_FINISH = openapi.Response(
			description=MSG_ROUND_FINISH,
			examples={"application/json": {"message": MSG_ROUND_FINISH,
				'data': {"round": "finish"}}}
	)

DOC_ERROR_IS_PLAYING= openapi.Response(
			description=MSG_ERROR_PLAYER,
			examples={"application/json": {"message": MSG_ERROR_PLAYER}}
	)

DOC_ERROR_START_MATCH= openapi.Response(
			description=MSG_ERROR_MATCH,
			examples={"application/json": {"message": MSG_ERROR_MATCH}}
	)

DOC_START_MATCH= openapi.Response(
			description=MSG_CREATE_MATCH,
			examples={"application/json": {"message": MSG_CREATE_MATCH, 'data': "return info send by /private_api/matches + add bot_level = 1 ou -1"}}
	)

DOC_ERROR_SCORE= openapi.Response(
			description=MSG_ERROR_SCORE_REQUIRED+' or '+MSG_ERROR_PLAYER_NOT_PLAYING,
			examples={"application/json": {"message": MSG_ERROR_SCORE_REQUIRED}}
	)

DOC_MATCH_TIE= openapi.Response(
			description=MSG_MATCH_TIE+' or '+MSG_MATCH_FINISH,
			examples={"application/json": {"message": MSG_MATCH_TIE}}
	)

MSG_ERROR_REQUIRED = "The field 'host_id' is required"
MSG_PLAYER_NOT_HOST = "Player is not the host of the tournament"
MSG_PLAYER_HOST = "Player is the host of the tournament"

DOC_ERROR_HOST_REQUIRED= openapi.Response(
			description=MSG_ERROR_REQUIRED,
			examples={"application/json": {"message": MSG_ERROR_REQUIRED}}
	)

DOC_PLAYER_HOST= openapi.Response(
			description=MSG_PLAYER_NOT_HOST+' or '+MSG_PLAYER_HOST,
			examples={"application/json": {"message": MSG_PLAYER_HOST,
						"data": {"is_host": True}}}
	)
