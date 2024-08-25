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
		
		this.player1 = new Player(this, this.#loaded_textures_names.player1, gameTextures.player1);
		this.player2 = new Player(this, this.#loaded_textures_names.player2, gameTextures.player2);

		//examples of pool use:
		let one_pipe_pair = this.#pipes_pairs_pool.getPipePair(100, 100, 400);
		let one_pipe_pair1 = this.#pipes_pairs_pool.getPipePair(100, 0, 700);
		let one_pipe_pair2 = this.#pipes_pairs_pool.getPipePair(100, -100, 1000);
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
			this.#ground = this.add.tileSprite(0, gameConfig.height - gameConfig.ground.height, gameConfig.width, gameTextures.ground.height, this.#loaded_textures_names.ground);
			this.#ground.setScale(1, gameConfig.ground.height / gameTextures.ground.height);
			this.#ground.setOrigin(0,0);
			this.depth = gameConfig.depth.ground;
		}
	
		update(){
			this.player1.update(300);
		}
}