class SceneBoot extends Phaser.Scene{

	#loaded_textures_names;
	#pipes_components;

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

		this.#pipes_components = this.physics.add.group();

		let test = new PipePair(this, this.#pipes_components, this.#loaded_textures_names.pipe_core, this.#loaded_textures_names.pipe_head, this.#loaded_textures_names.pipe_spacer, 300);
		test.setVerticalOffset(-100);
		test.x = 500;
	}


}