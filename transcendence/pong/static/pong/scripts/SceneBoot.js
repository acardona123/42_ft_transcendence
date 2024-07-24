class SceneBoot extends Phaser.Scene{
	constructor(){
		super("bootGame");
	}

	preload(){
		this.load.image("background", static_url + "pong/images/background.png");
	}

	create(){
		this.background = this.add.image(0, 0, "background");
		this.background.setOrigin(0,0);
	}
}