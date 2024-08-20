class SceneBoot extends Phaser.Scene{

	#loaded_textures_names;

	constructor(){
		super("bootGame");
		this.#loaded_textures_names = {
			pipe_core: "tex_pipe_core",
			pipe_exit: "tex_pipe_exit"
		}
	}

	//=== preload ===

	preload(){
		this.#preloadAllTextures();
	}

	#preloadAllTextures(){
		gameTextures.pipe.core.preloadOnScene(this, this.#loaded_textures_names.pipe_core);
		gameTextures.pipe.exit.preloadOnScene(this, this.#loaded_textures_names.pipe_exit);
	}

	create(){
		this.physics.world.collideDebug = true;

		const pipe = [];

		const sprite_pipe_exit = this.add.sprite(0, 0, this.#loaded_textures_names.pipe_exit).setOrigin(0);
		pipe.push(sprite_pipe_exit);
		const sprite_pipe_core = this.add.sprite(0, 0, this.#loaded_textures_names.pipe_core);
		pipe.push(sprite_pipe_core);
		Phaser.Actions.AlignTo(pipe, Phaser.Display.Align.BOTTOM_CENTER);

	}


}