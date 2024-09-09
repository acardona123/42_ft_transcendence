class SceneBoot extends Phaser.Scene{
	constructor(){
		super("bootGame");
		this.ball_name = "ball";
		this.background_name = "background";
	}

	//=== preload ===

	preload(){
		this.#preloadAllTextures();
	}

	#preloadAllTextures(){
		gameTextures.background.preloadOnScene(this, this.background_name);
		gameTextures.ball.preloadOnScene(this, this.ball_name);
	}

	//=== create ===

	#createAllAnimations(){
		gameTextures.background.createAnimationOnScene(this, this.background_name);
		gameTextures.ball.createAnimationOnScene(this, this.ball_name);
	}


	//=== controls ===
	#createPlayerControlsDisplay(){

	}
	#setPlayerControlKeys(player, key){
		//allowing the players to change input keys when button clicked
	}



	//=== start game Button ===
	#createStartButton(){
		//
	}
	#startGame(){
		//action done when the start button is clicked
		this.scene.start("playGame");
	}
	
	create(){
		this.#createAllAnimations();
		this.#createStartButton();
		this.#createPlayerControlsDisplay();
		this.#startGame();
	}


}