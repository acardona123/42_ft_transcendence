class SceneBoot extends Phaser.Scene{

	#scene_textures;

	#pipes_group;
	#pipes_pairs_pool;
	#active_pipes;

	#textboard;
	#ceiling;
	#background;
	#ground;

	#player_group;
	#player1;
	#player2;

	#controls;

	#velocity_x;
	#pipes_pair_horizontal_distance;
	#new_pipes_pair_trigger;

	constructor(){
		super("bootGame");
		this.#scene_textures = {
			pipe_core:		new SceneTexture(this,	"pipe_core",	gameTextures.pipe.core),
			pipe_head:		new SceneTexture(this,	"pipe_head",	gameTextures.pipe.head),
			pipe_spacer:	new SceneTexture(this,	"pipe_spacer",	gameTextures.pipe_spacer),
			player1:		new SceneTexture(this,	"player1",		gameTextures.player1),
			player2:		new SceneTexture(this,	"player2",		gameTextures.player2),
			ceiling:		new SceneTexture(this,	"ceiling",		gameTextures.ceiling),
			ground:			new SceneTexture(this,	"ground",		gameTextures.ground),
			background:		new SceneTexture(this,	"background",	gameTextures.background),
			death:			new SceneTexture(this,	"death",		gameTextures.death),
			textboard:		new SceneTexture(this,	"textboard",	gameTextures.textboard)
		}
	}

	//=== preload ===

	preload(){
		this.#preloadAllSceneTextures();
	}

	#preloadAllSceneTextures(){
		this.#scene_textures.pipe_core.preloadOnScene();
		this.#scene_textures.pipe_head.preloadOnScene();
		this.#scene_textures.pipe_spacer.preloadOnScene();
		this.#scene_textures.ceiling.preloadOnScene();
		this.#scene_textures.ground.preloadOnScene();
		this.#scene_textures.background.preloadOnScene();
		this.#scene_textures.player1.preloadOnScene();
		this.#scene_textures.player2.preloadOnScene();
		this.#scene_textures.death.preloadOnScene();
		this.#scene_textures.textboard.preloadOnScene();
	}

	create(){
		this.physics.world.collideDebug = true;
		this.#pipes_group = this.physics.add.group();
		this.#active_pipes = []
		this.#velocity_x = gameConfig.velocity_x.init_value;
		this.#pipes_pair_horizontal_distance = gameConfig.pipe_repartition.horizontal_distance_default;
		this.#new_pipes_pair_trigger = gameConfig.width - this.#pipes_pair_horizontal_distance - this.#calculatePipeWidth();

		this.#createTextboard();
		this.#createCeiling();
		this.#createBackground();
		this.#createGround();
		this.#createPipesPool();
		this.#createPlayers();
		this.#createPhysicalInteractions();
		this.#createControls();

		this.#introduceNewPipePair();

		//do a starting zone:
		this.#textboard.start();
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
			this.#player1 = new Player(this.#scene_textures.player1);
			this.#player2 = new Player(this.#scene_textures.player2);
		}

		#createPhysicalInteractions(){
			this.#createPlayerPipeCollision();
			this.#createPlayerGroundCollision();
			this.#createPlayerCeilingCollision();

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
			#createPlayerCeilingCollision(){
				this.physics.add.collider(this.#player1.object, this.#ceiling.object, () => {
					this.#repositionPlayer(this.#player1);
				});
				this.physics.add.collider(this.#player2.object, this.#ceiling.object, () => {
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
			this.#updateVelocities(delta)
			this.#updateJumpPlayers();
			this.#textboard.update();
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
				const offset_to_middle = this.#calculateRandomPipePairOffset();
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
				if (Phaser.Input.Keyboard.JustDown(jumpKey)){
					player.jump();
				}
			}
}