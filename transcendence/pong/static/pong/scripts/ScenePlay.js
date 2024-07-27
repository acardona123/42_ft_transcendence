class ScenePlay extends Phaser.Scene{
	constructor(){
		super("playGame");
	}

	create_background(){
		// - option 1: as a static image:
			// this.background = this.add.image(0, 0, "background");
		// - option2: as a TileSprite is a sprite with a repeating texture
			this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
		//moving the origin of the background image from its center to its top left corner (this will be the origin point used for rotation and position)
		this.background.setOrigin(0,0);
	}


	// ---- ship creation ----

		create_ships(){
			this.load_ships_objects();
			this.play_ships_animations();
		}

		load_ships_objects(){
			// loading the 3 ships in the scene
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
		}

		play_ships_animations(){
			this.ship1.play("ship1_anim");
			this.ship2.play("ship2_anim");
			this.ship3.play("ship3_anim");
		}
	

	//---- Power-ups
		create_power_ups(){
			this.create_power_ups_objects();
			this.create_power_ups_physic();
		}

		create_power_ups_objects(){
			this.powerUps = this.physics.add.group(); //creating a group for all the power-ups
			// creating a certain number of power-ups:

			for (var i = 0; i < gameSettings.powerUpsNumber; ++i){
				var new_powerUp = this.physics.add.sprite(16, 16, "power-up");
				this.powerUps.add(new_powerUp);
				//random animation
					if (Math.random() > 0.5){
						new_powerUp.play("power_up_red");
					} else{
						new_powerUp.play("power_up_grey");
					}
				//random initial position
				new_powerUp.setRandomPosition(0, 0, game.config.width, game.config.height);
				//random speed
				var velocityX = Math.random() * gameSettings.powerUpsInitialVelocity;
				var velocityY = Math.random() * gameSettings.powerUpsInitialVelocity;
				new_powerUp.setVelocity(velocityX, velocityY);
				// collisions
				new_powerUp.setCollideWorldBounds(true);
				new_powerUp.setBounce(1);
			}
		}

		create_power_ups_physic(){
			// this.physics.world.setBoundsCollision();
			this.physics.add.collider(this.powerUps, this.powerUps);
		}


	// ---- beams ----



	// ---- player ----

		create_player(){
			this.create_player_object();
			this.create_player_physic();
			this.play_player_animation();
		}


		create_player_object()
		{
			this.player = this.physics.add.sprite(config.width / 2 - 8, config.height / 2 - 64, "player");
		}

		play_player_animation(){
			this.player.play("player_anim");
		}

		create_player_physic(){
			this.player.setCollideWorldBounds(true);
		}

	// ---- interactions ----

		enable_ship_interactions(){
			this.ship1.setInteractive();
			this.ship2.setInteractive();
			this.ship3.setInteractive();
		}

		interaction_destroyShip(pointer, gameObject){
			gameObject.setTexture("explosion");
			gameObject.play("explode_anim");
		}


		create_objects_interactions(){
			//interaction done when the object is clicked
			this.input.on('gameobjectdown', this.interaction_destroyShip, this);
			//keyboard interactions
			this.cursorKeys = this.input.keyboard.createCursorKeys();
			this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
			this.projectiles = this.add.group();
		}

		movePlayerManager(){
			if (this.cursorKeys.left.isDown){
				this.player.setVelocityX(-gameSettings.playerSpeed);
			} else if (this.cursorKeys.right.isDown){
				this.player.setVelocityX(gameSettings.playerSpeed);
			} else{
				this.player.setVelocityX(0);
			}
			if (this.cursorKeys.up.isDown){
				this.player.setVelocityY(-gameSettings.playerSpeed);
			} else if (this.cursorKeys.down.isDown){
				this.player.setVelocityY(gameSettings.playerSpeed);
			} else{
				this.player.setVelocityY(0);
			}
		}

		shootBeamManager(){
			if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
				var beam = new Beam(this);
			}
		}


	create(){
		this.create_background();
		this.create_ships();
		this.create_power_ups();
		this.create_player();

		this.enable_ship_interactions();
		this.create_objects_interactions();
	
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

		this.movePlayerManager();
		this.shootBeamManager();
	}
}