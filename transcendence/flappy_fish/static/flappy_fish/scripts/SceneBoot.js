class SceneBoot extends Phaser.Scene{

	#loaded_textures_names;
	#pipes_group;
	#pipes_pairs_pool;
	#active_pipes;

	constructor(){
		super("bootGame");
		this.#loaded_textures_names = {
			pipe_core: "tex_pipe_core",
			pipe_head: "tex_pipe_head",
			pipe_spacer: "tex_pipe_spacer"
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
	}

	create(){
		this.physics.world.collideDebug = true;
		this.#pipes_group = this.physics.add.group();
		this.#active_pipes = []

		this.#createPipesPool();
		
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

}