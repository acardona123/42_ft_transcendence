class ScenePlay extends Phaser.Scene{

	#scene_textures;

	#pipes_group;
	#pipes_pairs_pool;
	#active_pipes;

	#textboard;
	#ceiling;
	#background;
	#ground;
	#starting_line;

	#player_group;
	#player1;
	#player2;

	#controls;

	#velocity_x;
	#pipes_pair_horizontal_distance;
	#new_pipes_pair_trigger;
	#game_started;

	constructor(){
		super("playGame");
		this.#game_started = false;
	}
	
	init(loaded_scene_textures){
		this.#scene_textures = loaded_scene_textures;
		for (const [key, value] of Object.entries(this.#scene_textures)){
			value.transferToScene(this);
		}	
	}


	create(){
		this.physics.world.collideDebug = true;
		this.#pipes_group = this.physics.add.group();
		this.#player_group = this.physics.add.group();
		this.#active_pipes = []
		this.#velocity_x = gameConfig.velocity_x.init_value;
		this.#pipes_pair_horizontal_distance = gameConfig.pipe_repartition.horizontal_distance_default;
		this.#new_pipes_pair_trigger = gameConfig.width - this.#pipes_pair_horizontal_distance - this.#calculatePipeWidth();

		this.#createAnimations();
		this.#createTextboard();
		this.#createCeiling();
		this.#createBackground();
		this.#createGround();
		this.#createPipesPool();
		this.#createPlayers();
		this.#createStartingLine();
		this.#createPhysicalInteractions();
		this.#createControls();

		this.#introduceNewPipePair(0);

	}
		#createAnimations(){
			for (const [key, value] of Object.entries(this.#scene_textures)){
				value.createAnimationOnScene();
			}		
		}
		#createTextboard(){
			this.#textboard = new Textboard(this, this.#scene_textures.textboard, this.#scene_textures.death, this.#scene_textures.player1, this.#scene_textures.player2);
		}

		#createCeiling(){
			this.#ceiling = new Ceiling(this.#scene_textures.ceiling);
		}

		#createBackground(){
			this.#background = new Background(this.#scene_textures.background);
		}

		#createGround(){
			this.#ground = new Ground(this.#scene_textures.ground);
		}

		#createPipesPool()
		{
			const pipe_textures = {
				core: this.#scene_textures.pipe_core,
				head: this.#scene_textures.pipe_head,
				spacer: this.#scene_textures.pipe_spacer}
			const pool_size = Math.fround(gameConfig.width / this.#calculatePipeWidth());
			this.#pipes_pairs_pool = new PipePairsPool(this, this.#pipes_group, pipe_textures, pool_size);
		}
			#calculatePipeWidth(){
				return (Math.max(gameConfig.pipe.core_width, gameConfig.pipe.head_width))
			}

		#createPlayers(){
			this.#player1 = new Player(this.#player_group, player_index.PLAYER1, this.#scene_textures.player1);
			this.#player2 = new Player(this.#player_group, player_index.PLAYER2, this.#scene_textures.player2);
		}

		#createStartingLine(){
			this.#starting_line = new StartingLine(this.#scene_textures.starting_line);
		}

		#createPhysicalInteractions(){
			this.#createStartingLineInteraction();
			this.#createPlayerPipeCollision();
			this.#createPlayerGroundCollision();
			this.#createPlayerCeilingCollision();

		}
			#createStartingLineInteraction(){
				this.physics.add.overlap(this.#starting_line.object, this.#player_group, () =>
				{
					if (!this.#game_started){
						this.#game_started = true;
						this.#player1.activateGravity(true);
						this.#player2.activateGravity(true);
						this.#textboard.start();
					}
				})
			}
			#createPlayerPipeCollision(){
				this.physics.add.collider(this.#pipes_group, this.#player_group, (pipe, player_object) => {
					if (player_object.is_active){
						this.#actionPlayerDeath(player_object);
					}
				});
			}
			#createPlayerGroundCollision(){
				this.physics.add.collider(this.#ground.object, this.#player_group, (ground, player_object) => {
					if (player_object.is_active){
						this.#actionPlayerDeath(player_object);
					}
				});
			}
			#createPlayerCeilingCollision(){
				this.physics.add.collider(this.#ceiling.object, this.#player_group, (ceiling, player_object) => {
					if (player_object.is_active){
						this.#actionPlayerDeath(player_object);
					}
				});
			}
				#actionPlayerDeath(player_object){
					
					this.#createExplosion(player_object);
					if (!this.#textboard.doesPlayerHasRemainingLife(player_object.index)){
						this.#gameOver();
					} else {
						this.#respawnPlayer(player_object);
						this.#addDeathToScoreboard(player_object);
					}
				}
					#createExplosion(player_object){
						new PlayerExplosion(this.#scene_textures.explosion, player_object.x, player_object.y);
					}
					#respawnPlayer(player_object){
						let y;
						if (this.#atLeastOneActivePipePair()){
							y = this.#active_pipes[0].y;
						} else {
							y = flyable_zone_center_y;
						}
						if (player_object.index === player_index.PLAYER1){
							this.#player1.respawn(y, this.#velocity_x);
						} else {
							this.#player2.respawn(y, this.#velocity_x);
						}
					}
					#addDeathToScoreboard(player_object){
						this.#textboard.addDeath(player_object.index);
					}

		#createControls(){
			this.#controls = {
				player1:  this.input.keyboard.addKey(gameConfig.controls.player1),
				player2: this.input.keyboard.addKey(gameConfig.controls.player2)
			};
		}


	//=== update ===
	
		update(time, delta){
			this.#updatePipesPairRecycling()
			this.#updateVelocities(delta)
			this.#updateJumpPlayers();
			this.#updateTextboard();
		}

		#updatePipesPairRecycling(){
			if (!this.#atLeastOneActivePipePair()){
				return;
			}
			if (this.#isFirstActivePipePairOut()){
				this.#pipes_pairs_pool.releasePipePair(this.#active_pipes.shift());
			}
			if (this.#newPipePairNeeded()){
				this.#introduceNewPipePair();
			}

		}
			#atLeastOneActivePipePair(){
				return (this.#active_pipes.length > 0);
			}
			#isFirstActivePipePairOut(){
				return (this.#isPipePairOut(this.#active_pipes[0]))
			}
				#isPipePairOut(pipe){
					return (pipe.x < - pipe.width / 2)
				}
			#newPipePairNeeded(){
				const last_pipe_pair = this.#active_pipes[this.#active_pipes.length - 1];
				return (last_pipe_pair.x < this.#new_pipes_pair_trigger)
			}
			#introduceNewPipePair(offset_to_middle = this.#calculateRandomPipePairOffset()){
				const targeted_spacer_height = gameConfig.pipe_spacer.height_default;
				const new_pipe_pair = this.#pipes_pairs_pool.getPipePair(targeted_spacer_height, offset_to_middle);
				this.#active_pipes.push(new_pipe_pair);

			}
				#calculateRandomPipePairOffset(){
					return (Phaser.Math.Between(-gameConfig.pipe_repartition.vertical_offset_max, gameConfig.pipe_repartition.vertical_offset_max));
				}

		#updateVelocities(delta){
			const delta_sec = delta / 1000;
			this.#velocity_x += delta_sec * gameConfig.velocity_x.acceleration;
			this.#updateVelocityPlayers();
			this.#updateVelocityCeiling(delta);
			this.#updateVelocityGround(delta);
			this.#updateVelocityPipes();
		}
			#updateVelocityPlayers(){
				this.#player1.update(this.#velocity_x);
				this.#player2.update(this.#velocity_x);
			}
			#updateVelocityCeiling(delta){
				this.#ceiling.update(this.#velocity_x, delta);
			}
			#updateVelocityGround(delta){
				this.#ground.update(this.#velocity_x, delta);
			}
			#updateVelocityPipes(){
				this.#active_pipes.forEach(pipe_pair => {
					pipe_pair.body.setVelocityX(-this.#velocity_x);
				})
			}
		
		#updateJumpPlayers(){
			this.#updateJumpPlayer(this.#player1, this.#controls.player1);
			this.#updateJumpPlayer(this.#player2, this.#controls.player2);
		}
			#updateJumpPlayer(player, jumpKey){
				if (this.#game_started && player.object.is_active && Phaser.Input.Keyboard.JustDown(jumpKey)){
					player.jump();
				}
			}
		
		#updateTextboard(){
			this.#textboard.update();
			if (this.#textboard.isTimeOver()){
				this.#gameOver();
			}
		}

		#gameOver(){
			this.scene.start("GameFinished",this.#textboard.getAllValues());
		}
}