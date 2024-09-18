# Matches public API 

## List match
`GET /api/matches/`
returns the data of all finished matches to which the player doing the request participated:
{
	game,
	date,
	duration,
	main_player_username,
	opponent_username,
	main_player_score,
	opponent_score
}

## Finish match
`PATCH /api/matches/finish/:id_match`
body:
{
	score1,
	score2,
	duration
}


## start match
### me against AI
The user that do the request can be an identified player or a guest. If it is a guest a random guest user will be generated and used for the game

`POST /api/matches/new/me-ai`
body:
{
	max_score,
	max_duration
}
### me against identified player
`POST /api/matches/new/me-player`
body:
{
	player2_id,
	player2_pin,
	max_score,
	max_duration
}
### me against guest
`POST /api/matches/new/me-guest`
body:
{
	max_score,
	max_duration
}