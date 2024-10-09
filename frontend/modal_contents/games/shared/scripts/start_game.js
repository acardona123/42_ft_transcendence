async function start_with_payload(url_end, payload){
	url = "https://localhost:8443/api/matches/new/" + url_end
	try {
		response = await fetch(url, {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
			"Content-type": "application/json; charset=UTF-8"
			},
			// add the authentication credentials here
		});
	}catch{
		console.log("fetch error")
	}

	try {
		if (!response.ok) {
			console.log(`fetch error: ${response.status}`);
			// throw ...
			return ;
		}
		response_json = await response.json();
		match_game_mode = response_json['data'][0];

		let gameMode;
		let gameConfig;
		if (payload["game"] === "FB"){
			gameConfig = fb_gameConfig;
			gameMode = fb_gameMode;
			gameMode.maxDeath = match_game_mode["max_score"];
		} else {
			gameMode = pg_gameMode;
			gameConfig = pg_gameConfig;
			gameMode.maxPoints = match_game_mode["max_score"];
			gameMode.bot_level = payload["bot_level"];
		}
		gameMode.maxTime = match_game_mode["max_duration"];
		gameMode.username_player1 = match_game_mode["main_player_username"];
		gameMode.username_player2 = match_game_mode["opponent_username"];
		var game= new Phaser.Game(gameConfig);
	} catch {
		console.log("error in start_guest");
		// display the error popup here
	}
}


async function start_player(tournament_id, game_symbol){
	if (game_symbol != "PG" && game_symbol != "FB"){
		throw new Error("The games must be identified as \"PG\" for pong or \"FB\" for Flappy Bird")
	}
	url_end = "me-player/"
	payload = {
		game: game_symbol,
		tournament_id: tournament_id,
		bot_level: -1
	}
	//extract and format data from the front form
	payload["max_score"] = 10;
	payload["max_duration"] = 5;
	payload["player2_id"] = 1;
	payload["player2_pin"] = 5678;

	await start_with_payload(url_end, payload);
}

async function start_guest(tournament_id, game_symbol){
	if (game_symbol != "PG" && game_symbol != "FB"){
		console.log("coucou");
		throw new Error("The games must be identified as \"PG\" for pong or \"FB\" for Flappy Bird")
	}
	url_end = "me-guest/"
	payload = {
		game: game_symbol,
		tournament_id: tournament_id,
		bot_level: -1
	}
	//extract and format data from the front form
	payload["max_score"] = 10;
	payload["max_duration"] = 5;

	await start_with_payload(url_end, payload);
}

async function start_ai(tournament_id, game_symbol){
	if (game_symbol != "PG" && game_symbol != "FB"){
		throw new Error("The games must be identified as \"PG\" for pong or \"FB\" for Flappy Bird")
	}
	url_end = "me-ai/"
	payload = {
		game: game_symbol,
		tournament_id: tournament_id,
		bot_level: 1
	}
	//extract and format data from the front form
	payload["max_score"] = 10;
	payload["max_duration"] = 5;

	await start_with_payload(url_end, payload);
}


// start_guest(-1, "FB");
start_guest(-1, "PG");