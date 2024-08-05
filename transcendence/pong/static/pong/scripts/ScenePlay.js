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
		this.createPlayers();
	}

	createBackground(){
		this.background = this.add.sprite(0, 0, "background");
		this.background.setDisplaySize(this.scale.width, this.scale.height);
		this.background.setSize(this.scale.width, this.scale.height);
		this.background.setOrigin(0,0);
	}

	createBall(x = gameConfig.width / 2,
			y = gameConfig.height / 2,
			radius = gameConfig.ball.default_radius,
			// velocityX = (Math.random() > 0.5 ? 1 : -1) * gameConfig.ball.init_velocity,
			velocityX = gameConfig.ball.init_velocity,
			velocityY = 0,
			color = gameConfig.ball.default_color,
			alpha = 1){
		let new_ball = new Ball(this, x, y, radius, velocityX, velocityY, color, alpha);
		return new_ball;
	}

	resetBall(ball)
	{
		ball.x = gameConfig.width / 2;
		ball.y = gameConfig.height / 2;
		ball.enableBody(true, x, y, true, true);
		let trajectory_angle = 90 - gameConfig.ball.max_bounce_angle + Math.random() * gameConfig.ball.max_bounce_angle * 2;

		
	}

	createPlayers(){
		this.player_left = new Paddle(this, "left", gameConfig.player.distance_to_border, gameConfig.height / 2, gameConfig.player.paddle_length, gameConfig.player.paddle_width, gameConfig.player.color, gameConfig.player.alpha);
		this.player_right = new Paddle(this, "right", gameConfig.width - gameConfig.player.distance_to_border, gameConfig.height / 2, gameConfig.player.paddle_length, gameConfig.player.paddle_width, gameConfig.player.color, gameConfig.player.alpha);
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
				bounce_angle = normal_angle + relative_contact * gameConfig.ball.max_bounce_angle;
			} else if (paddle.orientation === "right"){
				if (ball.x > paddle.getMiddleX()){
					ball.velocityY *= -1;
					return;
				}
				const normal_angle = 180;
				const contact_point = ball.y;
				const relative_contact = this.#calculateRelativeContact(paddle, contact_point, paddle.getMiddleY());
				bounce_angle = normal_angle - relative_contact * gameConfig.ball.max_bounce_angle;
			} else if (paddle.orientation === "top"){
				if (ball.y < paddle.getMiddleY()){
					ball.velocityX *= -1;
					return;
				}
				const normal_angle = 270;
				const contact_point = ball.x;
				const relative_contact = this.#calculateRelativeContact(paddle, contact_point, paddle.getMiddleX());
				bounce_angle = normal_angle + relative_contact * gameConfig.ball.max_bounce_angle;
			}
			else{ //paddle.orientation === "bottom"
				if (ball.y > paddle.getMiddleY()){
					ball.velocityX *= -1;
					return;
				}
				const normal_angle = 90;
				const contact_point = ball.x;
				const relative_contact = this.#calculateRelativeContact(paddle, contact_point, paddle.getMiddleX());
				bounce_angle = normal_angle - relative_contact * gameConfig.ball.max_bounce_angle;
			}
			
			const new_velocity = ball.body.velocity.length() * gameConfig.ball.bounce_coefficient;
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