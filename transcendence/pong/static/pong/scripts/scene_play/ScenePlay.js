class ScenePlay extends Phaser.Scene{

	#boot_textures;
	#scene_textures;

	#background;
	#borders;
	#scores;
	#clock;
	#player_left;
	#player_right;
	#ball;

	//physic groups
	#balls;
	#paddles;
	#bounce_borders;
	#death_borders;

	constructor(){
		super("PlayGame");
	}

	init(loaded_boot_textures){
		this.#boot_textures = loaded_boot_textures;
		this.#scene_textures = loaded_boot_textures.scenePlay;
		for (const [key, value] of Object.entries(this.#scene_textures)){
			value.transferToScene(this);
		}	
	}
	
	
	create(){
		this.#createAnimations();
		this.#createGroups();
		this.#createBackground();
		this.#createBorders();
		this.#createScores();
		this.#createClock();
		this.#createPlayers();
		this.#createInteractions();

		this.#newRound();
		this.#clock.start();
	}
		
	#createAnimations(){
		for (const [key, value] of Object.entries(this.#scene_textures)){
			value.createAnimationOnScene();
		}		
	}

	#createGroups(){
		this.#balls = this.physics.add.group();
		this.#paddles = this.physics.add.group();
		this.#bounce_borders = this.physics.add.group();
		this.#death_borders = this.physics.add.group();
	}

	#createBackground(){
		this.#background = new PlayBackground (this.#scene_textures.background);
	}

	#createBorders(){
		this.#borders = {};
		this.#createBounceBorders();
		this.#createDeathBorders();
	}
	#createBounceBorders(){
		this.#borders.top = new BounceBorder(this, border_side.TOP);
		this.#borders.bottom = new BounceBorder(this, border_side.BOTTOM);
	}
	#createDeathBorders(){
		this.#borders.right = new DeathBorder(this, border_side.RIGHT);
		this.#borders.left = new DeathBorder(this, border_side.LEFT);
	}

	#createScores(){
		this.#scores= {
			left: new Score(this, playerSide.LEFT),
			right: new Score(this, playerSide.RIGHT)	
		}
	}

	#createClock(){
		if (gameMode.maxTime > 0){
			this.#clock = new Timer(this, gameConfig.width / 2, gameConfig.scene_play.clock.padding_top, gameConfig.scene_play.clock, gameMode.maxTime)
		} else {
			this.#clock = new Chronometer(this, gameConfig.width / 2, gameConfig.scene_play.clock.padding_top, gameConfig.scene_play.clock)
		}
	}

	createBall(x = gameConfig.width / 2,
			y = gameConfig.height / 2,
			radius = gameConfig.scene_play.ball.default_radius,
			velocityX = 0,
			velocityY = 0,
			color = gameConfig.scene_play.ball.default_color,
			alpha = gameConfig.scene_play.ball.default_alpha){
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
				const random_trajectory_angle = Phaser.Math.Between(90 - gameConfig.scene_play.ball.max_bounce_angle, -90 + gameConfig.scene_play.ball.max_bounce_angle) + (Math.random() < 0.5 ? 180: 0);
				this.physics.velocityFromAngle(random_trajectory_angle, gameConfig.scene_play.ball.init_velocity, ball.body.velocity);
				},
				callbackScope: this
			})
	}

	#createPlayers(){
		this.#createPlayerLeft();
		this.#createPlayerRight();
	}
	#createPlayerLeft(){
		this.#player_left = new Paddle(this, "left", gameConfig.scene_play.player.distance_to_border, gameConfig.height / 2, gameConfig.scene_play.player.paddle_length, gameConfig.scene_play.player.paddle_width, gameConfig.scene_play.player.color.left, gameConfig.scene_play.player.alpha.left);
		
	}
	#createPlayerRight(){
		this.#player_right = new Paddle(this, "right", gameConfig.width - gameConfig.scene_play.player.distance_to_border, gameConfig.height / 2, gameConfig.scene_play.player.paddle_length, gameConfig.scene_play.player.paddle_width, gameConfig.scene_play.player.color.right, gameConfig.scene_play.player.alpha.right);
	}


	#createInteractions(){
		// this.physics.add.collider(this.balls, this.balls);
		this.#createBallPaddleCollision();
		this.#createPlayerBordersCollisions();
		this.#createBallDeathBorderCollision();
		this.#createBallBounceBorderCollision();
		this.#createPlayersControls();
	}

	
	#createBallPaddleCollision(){
		this.physics.add.collider(this.#balls, this.#paddles, (ball, paddle) => {
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
				bounce_angle = normal_angle + relative_contact * gameConfig.scene_play.ball.max_bounce_angle;
			} else if (paddle.orientation === "right"){
				if (ball.x > paddle.getMiddleX()){
					ball.velocityY *= -1;
					return;
				}
				const normal_angle = 180;
				const contact_point = ball.y;
				const relative_contact = this.#calculateRelativeContact(paddle, contact_point, paddle.getMiddleY());
				bounce_angle = normal_angle - relative_contact * gameConfig.scene_play.ball.max_bounce_angle;
			} else if (paddle.orientation === "top"){
				if (ball.y < paddle.getMiddleY()){
					ball.velocityX *= -1;
					return;
				}
				const normal_angle = 270;
				const contact_point = ball.x;
				const relative_contact = this.#calculateRelativeContact(paddle, contact_point, paddle.getMiddleX());
				bounce_angle = normal_angle + relative_contact * gameConfig.scene_play.ball.max_bounce_angle;
			}
			else{ //paddle.orientation === "bottom"
				if (ball.y > paddle.getMiddleY()){
					ball.velocityX *= -1;
					return;
				}
				const normal_angle = 90;
				const contact_point = ball.x;
				const relative_contact = this.#calculateRelativeContact(paddle, contact_point, paddle.getMiddleX());
				bounce_angle = normal_angle - relative_contact * gameConfig.scene_play.ball.max_bounce_angle;
			}
			
			const new_velocity = ball.body.velocity.length() * gameConfig.scene_play.ball.bounce_coefficient;
			this.physics.velocityFromAngle(bounce_angle, new_velocity, ball.body.velocity);

		});
	}

	#createPlayerBordersCollisions()
	{
		this.physics.add.collider(this.#paddles, this.#bounce_borders, );
	}

	#createBallDeathBorderCollision(){
		this.physics.add.collider(this.#balls, this.#death_borders, (ball, border) => {
			ball.destroy();
			if (border.orientation === border_side.LEFT){
				this.#scores.right.addPoints(1);
			} else if (border.orientation === border_side.RIGHT){
				this.#scores.left.addPoints(1);
			} else {
				throw new Error (`Undefined behavior for the collision of the ball with a Death border with the orientation ${border.orientation}`);
			}
			this.#newRound();
		});
	}

	#createBallBounceBorderCollision(){
		this.physics.add.collider(this.#balls, this.#bounce_borders);
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

	#createPlayersControls(){
		this.#setPlayerControls(this.#player_left, gameConfig.scene_play.player.controls.left.up.key_code, gameConfig.scene_play.player.controls.left.down.key_code);
		this.#setPlayerControls(this.#player_right, gameConfig.scene_play.player.controls.right.up.key_code, gameConfig.scene_play.player.controls.right.down.key_code);
	}
	#setPlayerControls(player, key_code_up, key_code_down){
		player.key_up = this.input.keyboard.addKey(key_code_up);
		player.key_down = this.input.keyboard.addKey(key_code_down);
	}
	
	#newRound(){
		this.#ball = this.createBall();
		this.resetBall(this.#ball);
	}

	update(){
		this.#movePlayersManager();
		this.#clock.update();
		if (this.#isPartyFinished()){
			this.scene.start("GameFinished", {scores: this.#scores, duration_ms: this.#clock.getPastTime()});
		}
	}

	#movePlayersManager(){
		this.#setPlayerVelocity(this.#player_left);
		this.#setPlayerVelocity(this.#player_right);
	}
	#setPlayerVelocity(player){
		const key_up_pressed = player.key_up.isDown;
		const key_down_pressed = player.key_down.isDown;
		const player_vertical_direction = key_down_pressed - key_up_pressed;
		player.body.setVelocityY(gameConfig.scene_play.player.max_speed * player_vertical_direction);
	}

	#isPartyFinished(){
		let party_finished = false;
		if (gameMode.maxPoints > 0){
			party_finished |= this.#scores.left.greaterThan(gameMode.maxPoints) || this.#scores.right.greaterThan(gameMode.maxPoints);
		}
		if (gameMode.maxTime > 0){
			party_finished |= this.#clock.isTimeOver();
		}
		return party_finished;
	}



	addToBallsGroup(object)
	{
		this.#balls.add(object)
	}

	addToPaddlesGroup(object)
	{
		this.#paddles.add(object)
	}

	addToBounceBordersGroup(object)
	{
		this.#bounce_borders.add(object)
	}

	addToDeathBordersGroup(object)
	{
		this.#death_borders.add(object)
	}


}