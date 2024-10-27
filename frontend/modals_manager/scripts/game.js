let game = undefined;

function stop_current_game(){
	if (game != undefined){
		game.destroy(false);
		game = undefined;
		custom_event = undefined;
	}

}

function start_pong_game(response_data, bot_level = -1)
{
	pg_gameMode.maxPoints = response_data["max_score"];
	pg_gameMode.maxTime = response_data["max_duration"];
	pg_gameMode.username_player1 = response_data["main_player_username"];
	pg_gameMode.username_player2 = response_data["opponent_username"];
	pg_gameMode.match_id = response_data["id"];
	pg_gameMode.bot_level = bot_level;
	pg_gameMode.tournament_id = response_data["tournament_id"];

	stop_current_game();
	game = new Phaser.Game(pg_gameConfig);
}

function start_flappybird_game(response_data)
{
	fb_gameMode.maxDeath = response_data["max_score"];
	fb_gameMode.maxTime = response_data["max_duration"];
	fb_gameMode.username_player1 = response_data["main_player_username"];
	fb_gameMode.username_player2 = response_data["opponent_username"];
	fb_gameMode.match_id = response_data["id"];
	stop_current_game();
	game = new Phaser.Game(fb_gameConfig);
}

function reset_game()
{
	stop_current_game();
	document.getElementById('phaser_game').innerHTML = "";
}
