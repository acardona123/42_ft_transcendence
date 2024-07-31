class ScenePlay extends Phaser.Scene{
	constructor(){
		super("playGame");
	}
	
	
	preload(){
	}
	
	create(){
		this.balls = this.add.group();
		this.pads = this.add.group();
		this.createBackground();
		this.createBall(500, 500, 100, 50, 30, "ball");
		this.createPaddle();
	}

	createBackground(){
		this.background = this.add.sprite(0, 0, "background");
		this.background.setDisplaySize(this.scale.width, this.scale.height);
		this.background.setSize(this.scale.width, this.scale.height);
		this.background.setOrigin(0,0);
	}

	createBall(x, y, radius, velocityX, velocityY, texture_key){
		// let new_ball = new Ball(this, x, y, texture_key);
		let new_ball = new Ball(this, x, y, radius, velocityX, velocityY, texture_key);
	}

	createPaddle(){
		this.paddle = new Paddle(this, 500, 500, 600, 60, 0xFF0000, 0);
		this.paddle1 = new Paddle(this, 500, 500, 600, 60, 0x00ff00, 5);
	}

	update(){}

}