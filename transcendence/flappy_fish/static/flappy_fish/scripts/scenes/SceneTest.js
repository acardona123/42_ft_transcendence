class SceneTest extends Phaser.Scene{
	texturesScene;
	time_test;
	textboard;

	constructor(){
		super("TestScene");
		this.texturesScene = {
			death: new SceneTexture(this, "death", gameTextures.death),
			player1: new SceneTexture(this, "player1", gameTextures.player1),
			player2: new SceneTexture(this, "player2", gameTextures.player2) 
		};
		this.time_test = 0
	}

	preload(){
		this.texturesScene.death.preloadOnScene();
		this.texturesScene.player1.preloadOnScene();
		this.texturesScene.player2.preloadOnScene();
	}

	create(){
		this.textboard = new Textboard(this, this.texturesScene.player1, this.texturesScene.death, this.texturesScene.player1, this.texturesScene.player2);
	}

	// update(time, delta){
	// 	if (Math.floor(time / 500) != this.time_test){
	// 		this.time_test = Math.floor(time / 1000);
	// 		// this.textboard.updatePlayerDied();
	// 	}
	// }

}