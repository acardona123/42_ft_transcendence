function calculateFlyableZoneCenterY(){
	const flyable_zone_min_y = fb_gameConfig.scenePlay.ceiling.height + fb_gameConfig.scenePlay.textboard.height;
	const flyable_zone_max_y = fb_gameConfig.height - fb_gameConfig.scenePlay.ground.height;
	const flyable_zone_center_y =  flyable_zone_min_y + (flyable_zone_max_y - flyable_zone_min_y) / 2;
	return (flyable_zone_center_y);
}

let flyable_zone_center_y = 0;



flyable_zone_center_y = calculateFlyableZoneCenterY();
var game= new Phaser.Game(fb_gameConfig);