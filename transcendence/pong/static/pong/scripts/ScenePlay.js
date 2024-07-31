class ScenePlay extends Phaser.Scene{
	constructor(){
		super("playGame");
	}
	
	
	preload(){
	}
	
	create(){
		this.balls = this.physics.add.group();
		this.paddles = this.physics.add.group();
		this.createBackground();
		this.createInteractions();
		this.ball1 = this.createBall();
		this.ball2 = this.createBall();
		this.player1 = this.createPaddle();
	}

	createBackground(){
		this.background = this.add.sprite(0, 0, "background");
		this.background.setDisplaySize(this.scale.width, this.scale.height);
		this.background.setSize(this.scale.width, this.scale.height);
		this.background.setOrigin(0,0);
	}

	createBall(x = gameConfig.width / 2,
		y = gameConfig.height / 2,
		radius = gameSettings.ball_default_radius,
		velocityX = (Math.random() > 0.5 ? 1 : -1) * gameSettings.ball_init_velocity,
		velocityY = 0,
		color = gameSettings.ball_default_color,
		alpha = 1){
		let new_ball = new Ball(this, x, y, radius, velocityX, velocityY, color, alpha);
		return new_ball;
	}

	createPaddle(){
		let scene= this;
		let middleX= 500;
		let middleY= 500;
		let length= 300;
		let width= 50;
		let color = 0x00FF00;
		let orientation = "right";
		let alpha = 1;

		let paddle = new Paddle(scene, middleX, middleY, length, width, color, orientation, alpha);
		return paddle;
	}

	createInteractions(){
		this.physics.add.collider(this.balls, this.balls);
		this.physics.add.collider(this.balls, this.paddles, function(ball, paddle){
			ball.body.setVelocityX *= 1.1;
			ball.body.setVelocityY *= 1.1;
			console.log("Collision");
		});
	}

	update(){}

}