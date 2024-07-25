class ScenePlay extends Phaser.Scene{
	constructor(){
		super("playGame");
	}

	create(){
		// loading the background:
			// - option 1: as a static image:
				// this.background = this.add.image(0, 0, "background");
			// - option2: as a TileSprite is a sprite with a repeating texture
				this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
			//moving the origin of the background image from its center to its top left corner (this will be the origin point used for rotation and position)
			this.background.setOrigin(0,0);

		// inserting the 3 ships in the scene
			// - option 1: as images, not animated
				// this.ship1 = this.add.image(config.width/2 - 50, config.height / 2, "ship1");
				// this.ship2 = this.add.image(config.width/2, config.height / 2, "ship2");
				// this.ship3 = this.add.image(config.width/2 + 50, config.height / 2, "ship3");
			// - option 2: as sprites, animates (loaded as spritesheet in SceneBoot)
				this.ship1 = this.add.sprite(config.width/2 - 50, config.height / 2, "ship1");
				this.ship2 = this.add.sprite(config.width/2, config.height / 2, "ship2");
				this.ship3 = this.add.sprite(config.width/2 + 50, config.height / 2, "ship3");

		//manipulation the ships
			this.ship1.setScale(4);
			// this.ship1.flipY = true;
			// this.ship1.angle += 45;

		// if the ships are sprites, setting their animations
			// creating animations for each ship and for their explosion when clicked
				//general function: this.anims.crate({key, frames, frameRate, repeat});
				this.anims.create({
					key: "ship1_anim", //if of the animation
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
				this.anims.create({
					key: "explode_anim", //if of the animation
					frames: this.anims.generateFrameNumbers("explosion"),
					frameRate: 20, //20 Hz
					repeat: 0, //no repetionm happens once
					hideOnComplete: true, //disappeares at the end of the animation
				});
			//applying the animations
				this.ship1.play("ship1_anim");
				this.ship2.play("ship2_anim");
				this.ship3.play("ship3_anim");
		
		//defining interactions (here destroy on click)
			// enable interactions
				this.ship1.setInteractive();
				this.ship2.setInteractive();
				this.ship3.setInteractive();
			// define the interaction:
				// defining the behaviour in case of interaction in a function outside of this one
				//creating the event that listen for interactions
				this.input.on('gameobjectdown', this.destroyShip, this);


	}

	// define what the interaction will do (here destroy the ship)
	destroyShip(pointer, gameObject){
		gameObject.setTexture("explosion");
		gameObject.play("explode_anim");
	}

	resetShipPos(ship){
		ship.y = 0;
		var randomX = Phaser.Math.Between(0, config.width);
		ship.x = randomX;
	}

	moveShip(ship, speed){
		ship.y += speed;
		if (ship.y > config.height){
			this.resetShipPos(ship);
		}
	}

	update(){
		this.moveShip(this.ship1, 1);
		this.moveShip(this.ship2, 2);
		this.moveShip(this.ship3, 3);
		this.background.tilePositionY -= 0.5;
	}
}