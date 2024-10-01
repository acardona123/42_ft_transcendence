# Matches private API 

## List match
`GET /api/matches/`
returns the data of all matches:
{
	id,
	game,
	player1,
	player2,
	score1,
	score2,
	duration,
	date,
	is_finished,
}

## start match
### player against identified player
`POST /api/matches/new/new_match_verified_id`
body:
{
	player1,
	player2,
	game,
	max_score,
	max_duration,
	clean_when_finished
}