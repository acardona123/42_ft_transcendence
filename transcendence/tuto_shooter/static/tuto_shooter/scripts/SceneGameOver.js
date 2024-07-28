class SceneGameOver extends Phaser.Scene{
	constructor(){
		super("GameOver");
	}

	create(){
		this.create_background();
		this.add.text(20, 20, "Game over !", {
			font: "25px Arial",
			fill: "yellow"
		});
	}

	create_background(){
		this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
		this.background.setOrigin(0,0);
	}
}