class SceneBoot extends Phaser.Scene{

	#loaded_textures_names;
	#pipes_group;
	#pipes_pairs_pool;
	#active_pipes;
	#ground;
	#background;
	#player1;
	#player2;
	#controls;

	#velocity_x;
	#pipes_pair_horizontal_distance;
	#new_pipes_pair_trigger;

	constructor(){
		super("bootGame");
		this.#loaded_textures_names = {
			pipe_core: "tex_pipe_core",
			pipe_head: "tex_pipe_head",
			pipe_spacer: "tex_pipe_spacer",
			ground: "tex_ground",
			background: "tex_background",
			player1: "tex_player1",
			player2: "tex_player2",
		}
	}

	//=== preload ===

	preload(){
		this.#preloadAllTextures();
	}

	#preloadAllTextures(){
		gameTextures.pipe.core.preloadOnScene(this, this.#loaded_textures_names.pipe_core);
		gameTextures.pipe.head.preloadOnScene(this, this.#loaded_textures_names.pipe_head);
		gameTextures.pipe_spacer.preloadOnScene(this, this.#loaded_textures_names.pipe_spacer);
		gameTextures.ground.preloadOnScene(this, this.#loaded_textures_names.ground);
		gameTextures.background.preloadOnScene(this, this.#loaded_textures_names.background);
		gameTextures.player1.preloadOnScene(this, this.#loaded_textures_names.player1);
		gameTextures.player2.preloadOnScene(this, this.#loaded_textures_names.player2);
	}

	create(){
		this.physics.world.collideDebug = true;
		this.#pipes_group = this.physics.add.group();
		this.#active_pipes = []
		this.#velocity_x = gameConfig.velocity_x.init_value;
		this.#pipes_pair_horizontal_distance = gameConfig.pipe_repartition.horizontal_distance_default;
		this.#new_pipes_pair_trigger = gameConfig.width - this.#pipes_pair_horizontal_distance - this.#calculatePipeWidth();

		this.#createGround();
		this.#createBackground();
		this.#createPipesPool();
		this.#createPlayers();
		this.#createPhysicalInteractions();
		this.#createControls();

		this.#introduceNewPipePair();
	}

		#createGround(){
			this.#ground = new Ground(this, this.#loaded_textures_names.ground);
		}

		#createBackground(){
			this.#background = new Background(this, this.#loaded_textures_names.background);
		}

		#createPipesPool()
		{
			const pipe_textures = {
				core: this.#loaded_textures_names.pipe_core,
				head: this.#loaded_textures_names.pipe_head,
				spacer: this.#loaded_textures_names.pipe_spacer}
			const pool_size = Math.fround(gameConfig.width / this.#calculatePipeWidth());
			this.#pipes_pairs_pool = new PipePairsPool(this, this.#pipes_group, pipe_textures, pool_size);
		}
			#calculatePipeWidth(){
				return (Math.max(gameConfig.pipe.core_width, gameConfig.pipe.head_width))
			}

		#createPlayers(){
			this.#player1 = new Player(this, this.#loaded_textures_names.player1, gameTextures.player1);
			this.#player2 = new Player(this, this.#loaded_textures_names.player2, gameTextures.player2);
		}

		#createPhysicalInteractions(){
			this.#createPlayerPipeCollision();
			this.#createPlayerGroundCollision();

		}
			#createPlayerPipeCollision(){
				this.physics.add.overlap(this.#player1.object, this.#pipes_group, () => {
					this.#repositionPlayer(this.#player1);
				});
				this.physics.add.overlap(this.#player2.object, this.#pipes_group, () => {
					this.#repositionPlayer(this.#player2);
				});
			}
			#createPlayerGroundCollision(){
				this.physics.add.collider(this.#player1.object, this.#ground.object, () => {
					this.#repositionPlayer(this.#player1);
				});
				this.physics.add.collider(this.#player2.object, this.#ground.object, () => {
					this.#repositionPlayer(this.#player2);
				});
			}
				#repositionPlayer(player){
					if (this.#atLeastOneActivePipePair()){
						player.object.y = this.#active_pipes[0].y;
					} else {
						player.object.y = (gameConfig.height - gameConfig.ground.height) / 2;
					}
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
			this.#updateVelocities(time, delta)
			this.#updateJumpPlayers();
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
			#introduceNewPipePair(){
				const targeted_spacer_height = gameConfig.pipe_spacer.height_default;
				const offset_to_middle = this.#calculateRandomPipePairOffset()
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
			this.#updateVelocityGround(delta);
			this.#updateVelocityPipes();
		}
			#updateVelocityPlayers(){
				this.#player1.update(this.#velocity_x);
				this.#player2.update(this.#velocity_x);
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
				if (Phaser.Input.Keyboard.JustDown(jumpKey)){
					player.jump();
				}
			}
}