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
			this.create_ship_group();
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

		create_ship_group(){
			this.enemies = this.physics.add.group();
			this.enemies.add(this.ship1);
			this.enemies.add(this.ship2);
			this.enemies.add(this.ship3);
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
				new_powerUp.setMaxVelocity(gameSettings.powerUpsmaxVelocity, gameSettings.powerUpsmaxVelocity);
				// collisions
				new_powerUp.setCollideWorldBounds(true);
				new_powerUp.setBounce(1);
			}
		}

		create_power_ups_physic(){
			// this.physics.world.setBoundsCollision();
		}


	// ---- Beam ----

	create_beams(){
		this.projectiles = this.add.group();
		//see Beam class 
	}


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

		resetPlayer(){
			var x = config.width / 2 - 8;
			var y = config.height + 64;
			this.player.enableBody(true, x, y, true, true);
			//respawn protection
			this.player.alpha = 0.5;//transparency
			var tween = this.tweens.add({ //smoth transition of a targeted variable
				targets: this.player,
				y: config.height - 64, //moves the sheep to this pos
				ease: 'Power1',
				duration: 1500,
				repeat: 0,
				onComplete: function(){this.player.alpha = 1;},
				callbackScope: this
			})
		}

	// ---- interactions ----

		enable_ship_interactions(){
			this.ship1.setInteractive();
			this.ship2.setInteractive();
			this.ship3.setInteractive();
		}

		// interaction_destroyShip(pointer, gameObject){
		// 	gameObject.setTexture("explosion");
		// 	gameObject.play("explode_anim");
		// }


		create_objects_interactions(){
			//keyboard interactions
			this.cursorKeys = this.input.keyboard.createCursorKeys();
			this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

			//interaction done when the object is clicked
			// this.input.on('gameobjectdown', this.interaction_destroyShip, this);

			//ingame physic interactions
			this.physics.add.collider(this.powerUps, this.powerUps);
			this.physics.add.collider(this.projectiles, this.powerUps, function(projectile, powerUp){
				projectile.destroy();
			});
			this.physics.add.overlap(this.player, this.powerUps, this.pickPowerUp, null, this);
			this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
			this.physics.add.overlap(this.projectiles, this.enemies,this.hitEnemy, null, this);
		}

		pickPowerUp(player, powerUp){
			powerUp.disableBody(true, true); //set inactive and invisible
		}

		hurtPlayer(player, enemy){
			this.resetShipPos(enemy);
			var explosion = new Explosion(this, player.x, player.y);
			if (this.player.alpha < 1){
				return;
			}
			player.disableBody(true, true);
			this.time.addEvent({
				delay: 1000,
				callback: this.resetPlayer,
				callbackScope: this,
				loop: false
			})
			// this.scene.start("GameOver");
		}

		hitEnemy(projectile, enemy){
			projectile.destroy();

			var explosion1 = new Explosion(this, enemy.x, enemy.y, enemy.scale);

			this.resetShipPos(enemy);
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
			if (this.player.active && Phaser.Input.Keyboard.JustDown(this.spacebar)){
				var beam = new Beam(this);
			}
			for (var i = 0; i < this.projectiles.getChildren().length; ++i){
				var beam = this.projectiles.getChildren()[i];
				beam.update();
			}
		}


	create(){
		this.create_background();
		this.create_ships();
		this.create_power_ups();
		this.create_beams();
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