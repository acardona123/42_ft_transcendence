class SceneBoot extends Phaser.Scene{
	constructor(){
		super("bootGame");
	}


	// =====
	//  preloading 
	// =====


	preload(){
		this.preload_assets();
	}

	preload_assets(){
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
			this.load.spritesheet("power-up", static_url + "pong/assets/spritesheets/power-up.png", {frameWidth:16, frameHeight:16});
		// loading the beams
			this.load.spritesheet("beam", static_url + "pong/assets/spritesheets/beam.png", {frameWidth: 16, frameHeight: 16});
		// loading the player
			this.load.spritesheet("player", static_url + "pong/assets/spritesheets/player.png", {frameWidth:16, frameHeight:24});
	}

	// =====
	// creation
	// =====

	create(){
		this.add.text(20,20, "Loading game...");
		this.create_anims();
		this.scene.start("playGame");
	}

	// --- animations ---

		create_anims(){
			//general function for animations: this.anims.crate({key, frames, frameRate, repeat});
			this.create_anim_ships();
			this.create_anim_player();
			this.create_anim_power_ups();
			this.create_anim_beam();
			this.create_anim_explosion();
		}

		create_anim_ships(){
			this.anims.create({
				key: "ship1_anim", //id of the animation
				frames: this.anims.generateFrameNumbers("ship1"),
				frameRate: 20, //20 Hz
				repeat: -1, //infinite loop
			});
			this.anims.create({
				key: "ship2_anim",
				frames: this.anims.generateFrameNumbers("ship2"),
				frameRate: 20,
				repeat: -1,
			});
			this.anims.create({
				key: "ship3_anim",
				frames: this.anims.generateFrameNumbers("ship3"),
				frameRate: 20,
				repeat: -1,
			});
		}

		create_anim_player(){
			this.anims.create({
				key: "player_anim",
				frames: this.anims.generateFrameNumbers("player"),
				frameRates: 20,
				repeat: -1,
			});
		}
		
		create_anim_power_ups(){
			this.anims.create({
				key: "power_up_red",
				frames: this.anims.generateFrameNumbers("power-up", {
					start: 0, //one can create 2 game objects from one sprite file
					end: 1
				}),
				frameRate: 20,
				repeat: -1
			});
			this.anims.create({
				key: "power_up_grey",
				frames: this.anims.generateFrameNumbers("power-up", {
					start: 2,
					end: 3
				}),
				frameRate: 20,
				repeat: -1
			})
		}

		create_anim_beam(){
			this.anims.create({
				key: "beam_anim",
				frames: this.anims.generateFrameNumbers("beam"),
				frameRate: 20,
				repeat: -1,
			})
		}

		create_anim_explosion(){
			this.anims.create({
				key: "explode_anim", //id of the animation
				frames: this.anims.generateFrameNumbers("explosion"),
				frameRate: 20, //20 Hz
				repeat: 0, //no repetition, happens once
				hideOnComplete: true, //disappears at the end of the animation
			});
		}
}