const player_index = Object.freeze({
	PLAYER1: Symbol("player1"),
	PLAYER2: Symbol("player2"),
});

function areLivesLimited(){
	return (gameMode.maxDeath > 0);
}

function isTimeLimited(){
	return (gameMode.maxTime > 0);
}

function calculateFlyableZoneCenterY(){
	const flyable_zone_min_y = gameConfig.ceiling.height + gameConfig.textboard.height;
	const flyable_zone_max_y = gameConfig.height - gameConfig.ground.height;
	const flyable_zone_center_y =  flyable_zone_min_y + (flyable_zone_max_y - flyable_zone_min_y) / 2;
	return (flyable_zone_center_y);
}

let flyable_zone_center_y = calculateFlyableZoneCenterY();

var game= new Phaser.Game(gameConfig);