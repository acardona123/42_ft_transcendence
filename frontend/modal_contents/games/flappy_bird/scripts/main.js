function calculateFlyableZoneCenterY(){
	const flyable_zone_min_y = fb_gameConfig.scenePlay.ceiling.height + fb_gameConfig.scenePlay.textboard.height;
	const flyable_zone_max_y = fb_gameConfig.height - fb_gameConfig.scenePlay.ground.height;
	const flyable_zone_center_y =  flyable_zone_min_y + (flyable_zone_max_y - flyable_zone_min_y) / 2;
	return (flyable_zone_center_y);
}

let flyable_zone_center_y = 0;



flyable_zone_center_y = calculateFlyableZoneCenterY();






function start_fb_guest(){
	url = "https://localhost:8443/api/matches/new-guest"
	// data: //extract and format from the front form
	data = {
		game: "pg",
		max_score,
		max_duration
		clean_when_finished
	}
	# response = requests.get(url)
	# status = response.status_code
	# data_content = response.json()
}

function start_fb_player(){

}


var game= new Phaser.Game(fb_gameConfig);