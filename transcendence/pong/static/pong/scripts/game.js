
var config = {
	width: 256,
	height: 272,
	backgroundColor: 0x000000,
	scene: [SceneBoot, ScenePlay],
	pixelArt: true,
	physics: {
		default: "arcade",
		arcade: {
			debug: false
		}
	}
}

var gameSettings = {
	playerSpeed: 200,
	powerUpsNumber: 3,
	powerUpsInitialVelocity: 50,
}

var game= new Phaser.Game(config);