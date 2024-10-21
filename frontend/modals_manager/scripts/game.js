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
	match_data = response_data["data"][0]
	pg_gameMode.maxPoints = match_data["max_score"];
	pg_gameMode.maxTime = match_data["max_duration"];
	pg_gameMode.username_player1 = match_data["main_player_username"];
	pg_gameMode.username_player2 = match_data["opponent_username"];
	pg_gameMode.match_id = match_data["id"];
	pg_gameMode.bot_level = bot_level;
	stop_current_game();
	game = new Phaser.Game(pg_gameConfig);
}

function start_flappybird_game(response_data)
{
	match_data = response_data["data"][0]
	fb_gameMode.maxDeath = match_data["max_score"];
	fb_gameMode.maxTime = match_data["max_duration"];
	fb_gameMode.username_player1 = match_data["main_player_username"];
	fb_gameMode.username_player2 = match_data["opponent_username"];
	fb_gameMode.match_id = match_data["id"];
	stop_current_game();
	game = new Phaser.Game(fb_gameConfig);
}

function reset_game()
{
	stop_current_game();
	document.getElementById('phaser_game').innerHTML = "";
}
