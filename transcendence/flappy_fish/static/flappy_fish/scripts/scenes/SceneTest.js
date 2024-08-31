class SceneTest extends Phaser.Scene{
	textureScene;

	constructor(){
		super("TestScene");
		this.textureScene = new SceneTexture(this, "icon", gameTextures.player1);
	}

	preload(){
		this.textureScene.preloadOnScene();
	}

	create(){
		let score1 = new Score(this, player_index.PLAYER1, this.textureScene, 500);
		score1.x = 600;
		score1.y = 600
		score1.body.setVelocity(10, 10)

	}

}