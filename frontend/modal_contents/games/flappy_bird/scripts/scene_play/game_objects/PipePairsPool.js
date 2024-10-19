class fb_PipePairsPool {

	#scene;
	#pipe_group;
	#pipe_textures;
	#pool;

	constructor(scene, pipe_group, pipe_textures, pool_initial_size = 1) {
		this.#scene = scene;
		this.#pipe_group = pipe_group;
		this.#pipe_textures = pipe_textures;
		this.#pool = [];
		this.#createInitialPool(pool_initial_size);
	}
	
	#createInitialPool(pool_initial_size) {
		for (let i = 0; i < pool_initial_size; i++){
			let pipePair = new fb_PipePair(this.#scene, this.#pipe_group, this.#pipe_textures);
			pipePair.disable();
			this.#pool.push(pipePair);
		}
	}

	getPipePair(targeted_spacer_height, offset_to_middle = 0, x = fb_gameConfig.width) {
		if (this.#pool.length > 0) {
			let pipePair = this.#pool.pop();
			pipePair.reactivate(targeted_spacer_height, offset_to_middle, x)
			return (pipePair);
		} else {
			console.log("Warning: a new pipePair had to be added to the pool, maybe consider increasing its initial size");
			return (new fb_PipePair(this.#scene, this.#pipe_group, this.#pipe_textures, targeted_spacer_height, offset_to_middle, x));
		}
	}

	releasePipePair(pipePair) {
		pipePair.disable();
		this.#pool.push(pipePair);
	}
}