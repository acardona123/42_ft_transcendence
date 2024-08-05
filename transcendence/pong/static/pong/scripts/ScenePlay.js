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
		this.ball = this.createBall();
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
			// velocityX = (Math.random() > 0.5 ? 1 : -1) * gameSettings.ball_init_velocity,
			velocityX = - gameSettings.ball_init_velocity,
			velocityY = 0,
			color = gameSettings.ball_default_color,
			alpha = 1){
		let new_ball = new Ball(this, x, y, radius, velocityX, velocityY, color, alpha);
		return new_ball;
	}

	resetBall(ball)
	{
		ball.x = gameConfig.width / 2;
		ball.y = gameConfig.height / 2;
		ball.enableBody(true, x, y, true, true);
		let trajectory_angle = 90 - gameSettings.ball_max_bounce_angle + Math.random() * gameSettings.ball_max_bounce_angle * 2;

		
	}

	createPaddle(){
		let scene= this;
		let middle_x= 300;
		let middle_y=  gameConfig.height / 2 - 0;
		let length= 300;
		let width= 50;
		let color = 0x00FF00;
		let orientation = "left";
		let alpha = 1;

		let paddle = new Paddle(scene, middle_x, middle_y, length, width, color, orientation, alpha);
		return paddle;
	}

	createInteractions(){
		// this.physics.add.collider(this.balls, this.balls);
		this.#createBallPaddleCollision();
	}
	#createBallPaddleCollision(){
		this.physics.add.collider(this.balls, this.paddles, (ball, paddle) => {
			//bounce angle
			let bounce_angle;
			if (paddle.orientation === "left"){
				if (ball.x < paddle.getMiddleX()){
					ball.velocityY *= -1;
					return;
				}
				const normal_angle = 0;
				// const contact_point = ball.body.touching.paddle.y;
				const contact_point = ball.y;
				const relative_contact = this.#calculateRelativeContact(paddle, contact_point, paddle.getMiddleY());
				bounce_angle = normal_angle + relative_contact * gameSettings.ball_max_bounce_angle;
			} else if (paddle.orientation === "right"){
				if (ball.x > paddle.getMiddleX()){
					ball.velocityY *= -1;
					return;
				}
				const normal_angle = 180;
				const contact_point = ball.y;
				const relative_contact = this.#calculateRelativeContact(paddle, contact_point, paddle.getMiddleY());
				bounce_angle = normal_angle - relative_contact * gameSettings.ball_max_bounce_angle;
			} else if (paddle.orientation === "top"){
				if (ball.y < paddle.getMiddleY()){
					ball.velocityX *= -1;
					return;
				}
				const normal_angle = 270;
				const contact_point = ball.x;
				const relative_contact = this.#calculateRelativeContact(paddle, contact_point, paddle.getMiddleX());
				bounce_angle = normal_angle + relative_contact * gameSettings.ball_max_bounce_angle;
			}
			else{ //paddle.orientation === "bottom"
				if (ball.y > paddle.getMiddleY()){
					ball.velocityX *= -1;
					return;
				}
				const normal_angle = 90;
				const contact_point = ball.x;
				const relative_contact = this.#calculateRelativeContact(paddle, contact_point, paddle.getMiddleX());
				bounce_angle = normal_angle - relative_contact * gameSettings.ball_max_bounce_angle;
			}
			
			const new_velocity = ball.body.velocity.length() * gameSettings.ball_bounce_coefficient;
			this.physics.velocityFromAngle(bounce_angle, new_velocity, ball.body.velocity);

		});
	}

	#calculateRelativeContact(paddle, contact_point, middle_point){
		const relative_contact =  2 * (contact_point - middle_point) / paddle.length;
		if (relative_contact < -1){
			return (-1);
		} else if (relative_contact > 1){
			return (1);
		}
		return (relative_contact);
	}

	update(){
	}

	//velocityFromAngle(angle, 200, sprite.body.velocity)

}