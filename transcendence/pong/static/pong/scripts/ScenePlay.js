class ScenePlay extends Phaser.Scene{

	background;
	borders;
	scores;
	clock;
	player_left;
	player_right;
	ball;

	//physic groups
	balls;
	paddles;
	bounce_borders;
	death_borders;

	constructor(){
		super("playGame");
	}
	
	preload(){
	}
	
	create(){
		this.balls = this.physics.add.group();
		this.paddles = this.physics.add.group();
		this.bounce_borders = this.physics.add.group();
		this.death_borders = this.physics.add.group();

		this.createBackground();
		this.createBorders();
		this.createScores();
		this.createClock();
		this.createPlayers();
		this.createInteractions();

		this.newRound();
	}

	createBackground(){
		this.background = this.add.sprite(0, 0, "background");
		this.background.setDisplaySize(this.scale.width, this.scale.height);
		this.background.setSize(this.scale.width, this.scale.height);
		this.background.setOrigin(0,0);
	}

	createBorders(){
		this.borders = {};
		this.#createBounceBorders();
		this.#createDeathBorders();
	}
	#createBounceBorders(){
		this.borders.top = new BounceBorder(this, border_side.TOP);
		this.borders.bottom = new BounceBorder(this, border_side.BOTTOM);
	}
	#createDeathBorders(){
		this.borders.right = new DeathBorder(this, border_side.RIGHT);
		this.borders.left = new DeathBorder(this, border_side.LEFT);
	}

	createScores(){
		this.scores= {
			left: new Score(this, playerSide.LEFT),
			right: new Score(this, playerSide.RIGHT)	
		}
	}

	createClock(){
		//test timer
		this.clock = new Timer(this, gameConfig.width / 2, gameConfig.clock.padding_top, 10)
		//test chronometer
		this.clock1 = new Chronometer(this, gameConfig.width / 2, gameConfig.clock.padding_top + 250)
	}

	createBall(x = gameConfig.width / 2,
			y = gameConfig.height / 2,
			radius = gameConfig.ball.default_radius,
			velocityX = 0,
			velocityY = 0,
			color = gameConfig.ball.default_color,
			alpha = gameConfig.ball.default_alpha){
		let new_ball = new Ball(this, x, y, radius, velocityX, velocityY, color, alpha);
		return new_ball;
	}
	resetBall(ball)
	{
		this.#recenterBall(ball);
		this.#launchBallRandomly(ball);
	}
	#recenterBall(ball){
		ball.velocityX = 0;
		ball.velocityY = 0;
		ball.x = gameConfig.width / 2;
		ball.y = gameConfig.height / 2;
	}
	#launchBallRandomly(ball){
		let old_alpha = ball.alpha;
		ball.alpha *= 0.5;
		var tween = this.tweens.add({ //smooth transition of a targeted variable
			targets: ball,
			ease: 'Power1',
			alpha: old_alpha,
			duration: 1500,
			repeat: 0,
			onComplete: function(){
				const random_trajectory_angle = this.#randomBetweenBounds(90 - gameConfig.ball.max_bounce_angle, -90 + gameConfig.ball.max_bounce_angle) + (Math.random() < 0.5 ? 180: 0);
				this.physics.velocityFromAngle(random_trajectory_angle, gameConfig.ball.init_velocity, ball.body.velocity);
				},
				callbackScope: this
			})
	}
	#randomBetweenBounds(minimum, maximum){
		if (minimum > maximum){
			const tmp = maximum;
			maximum = minimum;
			minimum = tmp;
		}
		return (minimum + (maximum - minimum) * Math.random());
	}

	createPlayers(){
		this.#createPlayerLeft();
		this.#createPlayerRight();
	}
	#createPlayerLeft(){
		this.player_left = new Paddle(this, "left", gameConfig.player.distance_to_border, gameConfig.height / 2, gameConfig.player.paddle_length, gameConfig.player.paddle_width, gameConfig.player.left.color, gameConfig.player.left.alpha);
		
	}
	#createPlayerRight(){
		this.player_right = new Paddle(this, "right", gameConfig.width - gameConfig.player.distance_to_border, gameConfig.height / 2, gameConfig.player.paddle_length, gameConfig.player.paddle_width, gameConfig.player.right.color, gameConfig.player.right.alpha);
	}


	createInteractions(){
		// this.physics.add.collider(this.balls, this.balls);
		this.#createBallPaddleCollision();
		this.#createPlayerBordersCollisions();
		this.#createBallDeathBorderCollision();
		this.#createBallBounceBorderCollision();
		this.#createPlayersControles();
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

	#createPlayerBordersCollisions()
	{
		this.physics.add.collider(this.paddles, this.bounce_borders, );
	}

	#createBallDeathBorderCollision(){
		this.physics.add.collider(this.balls, this.death_borders, (ball, border) => {
			ball.destroy();
			if (border.orientation === border_side.LEFT){
				this.scores.right.addPoints(1);
			} else if (border.orientation === border_side.RIGHT){
				this.scores.left.addPoints(1);
			} else {
				throw new Error (`Undefined behavior for the collision of the ball with a Death border with the orientation ${border.orientation}`);
			}
			this.newRound();
		});
	}

	#createBallBounceBorderCollision(){
		this.physics.add.collider(this.balls, this.bounce_borders);
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

	#createPlayersControles(){
		this.#setPlayerControls(this.player_left, Phaser.Input.Keyboard.KeyCodes.W, Phaser.Input.Keyboard.KeyCodes.S);
		this.#setPlayerControls(this.player_right, Phaser.Input.Keyboard.KeyCodes.I , Phaser.Input.Keyboard.KeyCodes.K);
	}
	#setPlayerControls(player, key_code_up, key_code_down){
		player.key_up = this.input.keyboard.addKey(key_code_up);
		player.key_down = this.input.keyboard.addKey(key_code_down);
	}
	
	newRound(){
		this.ball = this.createBall();
		this.resetBall(this.ball);
	}

	update(){
		this.#movePlayersManager();
		this.clock.update();
		this.clock1.update();
	}

	#movePlayersManager(){
		this.#setPlayerVelocity(this.player_left);
		this.#setPlayerVelocity(this.player_right);
	}
	#setPlayerVelocity(player){
		const key_up_pressed = player.key_up.isDown;
		const key_down_pressed = player.key_down.isDown;
		const player_vertical_direction = key_down_pressed - key_up_pressed;
		player.body.setVelocityY(gameConfig.player.max_speed * player_vertical_direction);
	}
}

async function delayedExecution(delay_ms) {
	console.log("before timeout")
	await new Promise(resolve => setTimeout(resolve, delay_ms));
	console.log("after timeout")
}