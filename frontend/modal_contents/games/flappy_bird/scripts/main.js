function calculateFlyableZoneCenterY(){
	const flyable_zone_min_y = fb_gameConfig.scenePlay.ceiling.height + fb_gameConfig.scenePlay.textboard.height;
	const flyable_zone_max_y = fb_gameConfig.height - fb_gameConfig.scenePlay.ground.height;
	const flyable_zone_center_y =  flyable_zone_min_y + (flyable_zone_max_y - flyable_zone_min_y) / 2;
	return (flyable_zone_center_y);
}

let flyable_zone_center_y = 0;
flyable_zone_center_y = calculateFlyableZoneCenterY();

async function start_fb_guest(){
	url = "https://localhost:8443/api/matches/new/me-guest/"
	payload = {
		game: "FB",
		tournament_id: -1
	}
	//extract and format data from the front form
	payload["max_score"] = 10;
	payload["max_duration"] = 5;

	try {
		response = await fetch(url, {
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
			"Content-type": "application/json; charset=UTF-8"
			},
			// add the authentication credentials here
		});

		if (!response.ok) {
			console.log(`fetch error: ${response.status}`)
			// throw ...
			return ;
		}
		response_json = await response.json();
		match_game_mode = response_json['data'][0];
		fb_gameMode.maxTime = match_game_mode["max_duration"];
		fb_gameMode.maxDeath = match_game_mode["max_score"];
		fb_gameMode.username_player1 = match_game_mode["main_player_username"];
		fb_gameMode.username_player2 = match_game_mode["opponent_username"];
		console.log("gamemode:")//
		console.log(fb_gameMode)//
		var game= new Phaser.Game(fb_gameConfig);
	} catch {
		console.log("error in start_fb_guest")
		// display the error popup here
	}
}

start_fb_guest();

// function start_fb_player(){

// }