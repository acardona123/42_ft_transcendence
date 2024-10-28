# Matches private API 

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
	tournament_id
}