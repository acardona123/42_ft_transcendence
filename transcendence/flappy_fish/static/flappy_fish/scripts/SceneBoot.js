class SceneBoot extends Phaser.Scene{

	#loaded_textures_names;
	#pipes_group;
	#pipes_pairs_pool;
	#active_pipes;
	#ground;
	#player1;
	#player2;

	constructor(){
		super("bootGame");
		this.#loaded_textures_names = {
			pipe_core: "tex_pipe_core",
			pipe_head: "tex_pipe_head",
			pipe_spacer: "tex_pipe_spacer",
			ground: "tex_ground",
			player1 : "tex_player1",
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
		gameTextures.player1.preloadOnScene(this, this.#loaded_textures_names.player1);
		gameTextures.player2.preloadOnScene(this, this.#loaded_textures_names.player2);
	}

	create(){
		this.physics.world.collideDebug = true;
		this.#pipes_group = this.physics.add.group();
		this.#active_pipes = []

		this.#createGround();
		this.#createPipesPool();
		this.#createPlayers();

		//examples of pool use:
		this.#active_pipes.push(this.#pipes_pairs_pool.getPipePair(400, 100, 400));
		this.#active_pipes.push(this.#pipes_pairs_pool.getPipePair(400, 0, 1000));
		this.#active_pipes.push(this.#pipes_pairs_pool.getPipePair(400, -100, 1800));
	}
		#createPipesPool()
		{
			const pipe_textures = {
				core: this.#loaded_textures_names.pipe_core,
				head: this.#loaded_textures_names.pipe_head,
				spacer: this.#loaded_textures_names.pipe_spacer}
			this.#pipes_pairs_pool = new PipePairsPool(this, this.#pipes_group, pipe_textures, gameConfig.pipes_pool_size);
		}
		#createGround(){
			this.#ground = new Ground(this, this.#loaded_textures_names.ground);
		}

		#createPlayers(){
			this.player1 = new Player(this, this.#loaded_textures_names.player1, gameTextures.player1);
			this.player2 = new Player(this, this.#loaded_textures_names.player2, gameTextures.player2);
		}


	
		update(time, delta){
			const velocity_x = 200; //will be increasing during the round
			this.#update_players(velocity_x);
			this.#update_ground(velocity_x, delta);
			this.#update_pipes(velocity_x);
		}
			#update_players(velocity_x){
				this.player1.update(velocity_x);
				this.player2.update(velocity_x);
			}
			#update_ground(velocity_x, delta){
				this.#ground.update(velocity_x, delta);
			}
			#update_pipes(velocity_x){
				this.#active_pipes.forEach(pipe_pair => {
					pipe_pair.body.setVelocityX(-velocity_x);

					//test repositioning
					if (pipe_pair.body.x < - pipe_pair.width){
						pipe_pair.body.x = gameConfig.width;
					}
				})
			}

}