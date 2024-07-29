class SceneBoot extends Phaser.Scene{
	constructor(){
		super("bootGame");
	}

	preload(){
		this.#preloadAllTextures();
	}

	// ==== preloading textures ====

	#preloadAllTextures(){
		gameTextures.background.preloadOnScene(this, "background");
		gameTextures.ball.preloadOnScene(this, "ball");
	}
}