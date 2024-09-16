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
`POST /api/matches/new/player-player`
body:
{
	player1,
	player2,
	max_score,
	max_duration
}