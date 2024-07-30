class SceneBoot extends Phaser.Scene{
	constructor(){
		super("bootGame");
		this.ball_name = "ball";
		this.background_name = "background";
	}

	preload(){
		this.#preloadAllTextures();
	}

	#preloadAllTextures(){
		gameTextures.background.preloadOnScene(this, this.background_name);
		gameTextures.ball.preloadOnScene(this, this.ball_name);
	}

	create(){
		this.#createAllAnimations();
		this.scene.start("playGame");
	}

	#createAllAnimations(){
		gameTextures.background.createAnimationOnScene(this, this.background_name);
		gameTextures.ball.createAnimationOnScene(this, this.ball_name);
	}
	
}