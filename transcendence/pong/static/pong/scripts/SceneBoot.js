class SceneBoot extends Phaser.Scene{
	constructor(){
		super("bootGame");
	}

	preload(){
		//loading background as an image
			this.load.image("background", static_url + "pong/assets/images/background.png");
		//loading the ships
			// option 1: as images, not animated
				// this.load.image("ship1", static_url + "pong/assets/images/ship1.png");
				// this.load.image("ship2", static_url + "pong/assets/images/ship2.png");
				// this.load.image("ship3", static_url + "pong/assets/images/ship3.png");
			//- option 2: as spritesheet, animated image
				this.load.spritesheet("ship1", static_url + "pong/assets/spritesheets/ship1.png", {frameWidth:16, frameHeight:16});
				this.load.spritesheet("ship2", static_url + "pong/assets/spritesheets/ship2.png", {frameWidth:32, frameHeight:16});
				this.load.spritesheet("ship3", static_url + "pong/assets/spritesheets/ship3.png", {frameWidth:32, frameHeight:32});
		// loading the explosion and power up sprites
			this.load.spritesheet("explosion", static_url + "pong/assets/spritesheets/explosion.png", {frameWidth:16, frameHeight:16});
			this.load.spritesheet("power-up",  static_url + "pong/assets/spritesheets/power-up.png", {frameWidth:16, frameHeight:16});
		// loading the player
			this.load.spritesheet("player", static_url + "pong/assets/spritesheets/player.png", {frameWidth:16, frameHeight:24});
	}

	create(){
		this.add.text(20,20, "Loading game...");
		this.scene.start("playGame")
	}
}