let game = null;

async function stop_current_game(){
	if (game != null){
		await game.destroy(false);
		game = null;
		custom_event = null;
	}

	let game_div = document.getElementById("phaser_game")
	game_div.innerHTML = "";
}

async function start_pong_game(response_data, bot_level = -1)
{
	pg_gameMode.maxPoints = response_data["max_score"];
	pg_gameMode.maxTime = response_data["max_duration"];
	pg_gameMode.username_player1 = response_data["main_player_username"];
	pg_gameMode.username_player2 = response_data["opponent_username"];
	pg_gameMode.match_id = response_data["id"];
	pg_gameMode.bot_level = bot_level;
	pg_gameMode.tournament_id = response_data["tournament_id"];

	await stop_current_game();
	game = new Phaser.Game(pg_gameConfig);
}

async function start_flappybird_game(response_data)
{
	fb_gameMode.maxDeath = response_data["max_score"];
	fb_gameMode.maxTime = response_data["max_duration"];
	fb_gameMode.username_player1 = response_data["main_player_username"];
	fb_gameMode.username_player2 = response_data["opponent_username"];
	fb_gameMode.match_id = response_data["id"];
	fb_gameMode.tournament_id = response_data["tournament_id"];

	await stop_current_game();
	game = new Phaser.Game(fb_gameConfig);
}

async function reset_game()
{
	await stop_current_game();
	document.getElementById('phaser_game').innerHTML = "";
}

async function exit_match_save_fail(match_results){
	await stop_current_game();
	const alert_text = `Error while trying to save the match results. Match ${pg_gameMode.tournament_id >= 0 ? "and tournament":""} cancelled.\n\nHere are your match results nonetheless:\nGame duration: ${match_results.duration}\nScores:\n  ${pg_gameMode.username_player1}: ${match_results.score1} deaths\n  ${pg_gameMode.username_player2}: ${match_results.score2}`;
	close_modal('modal-game', reset_game, false);
	alert(alert_text);
}
