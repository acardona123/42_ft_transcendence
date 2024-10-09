class pg_ScenePlay extends Phaser.Scene{

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
		this.time.delayedCall(10, () => {
			this.#clock.start();
		}, [], this);
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
		this.#background = new pg_PlayBackground (this.#scene_textures.background);
	}

	#createBorders(){
		this.#borders = {};
		this.#createBounceBorders();
		this.#createDeathBorders();
	}
	#createBounceBorders(){
		this.#borders.top = new pg_BounceBorder(this, border_side.TOP);
		this.#borders.bottom = new pg_BounceBorder(this, border_side.BOTTOM);
	}
	#createDeathBorders(){
		this.#borders.right = new pg_DeathBorder(this, border_side.RIGHT);
		this.#borders.left = new pg_DeathBorder(this, border_side.LEFT);
	}

	#createScores(){
		this.#scores= {
			left: new pg_Score(this, playerSide.LEFT),
			right: new pg_Score(this, playerSide.RIGHT)	
		}
	}

	#createClock(){
		if (pg_gameMode.maxTime > 0){
			this.#clock = new pg_Timer(this, pg_gameConfig.width / 2, pg_gameConfig.scene_play.clock.padding_top, pg_gameConfig.scene_play.clock, pg_gameMode.maxTime)
		} else {
			this.#clock = new pg_Chronometer(this, pg_gameConfig.width / 2, pg_gameConfig.scene_play.clock.padding_top, pg_gameConfig.scene_play.clock)
		}
	}

	createBall(x = pg_gameConfig.width / 2,
			y = pg_gameConfig.height / 2,
			radius = pg_gameConfig.scene_play.ball.default_radius,
			velocityX = 0,
			velocityY = 0,
			color = pg_gameConfig.scene_play.ball.default_color,
			alpha = pg_gameConfig.scene_play.ball.default_alpha){
		let new_ball = new pg_Ball(this, x, y, radius, velocityX, velocityY, color, alpha);
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
		ball.x = pg_gameConfig.width / 2;
		ball.y = pg_gameConfig.height / 2;
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
				const random_trajectory_angle = Phaser.Math.Between(90 - pg_gameConfig.scene_play.ball.max_bounce_angle, -90 + pg_gameConfig.scene_play.ball.max_bounce_angle) + (Math.random() < 0.5 ? 180: 0);
				this.physics.velocityFromAngle(random_trajectory_angle, pg_gameConfig.scene_play.ball.init_velocity, ball.body.velocity);
				},
				callbackScope: this
			})
	}

	#createPlayers(){
		this.#createPlayerLeft();
		this.#createPlayerRight();
	}
	#createPlayerLeft(){
		this.#player_left = new pg_Paddle(this, "left", pg_gameConfig.scene_play.player.distance_to_border, pg_gameConfig.height / 2, pg_gameConfig.scene_play.player.paddle_length, pg_gameConfig.scene_play.player.paddle_width, pg_gameConfig.scene_play.player.color.left, pg_gameConfig.scene_play.player.alpha.left);
		
	}
	#createPlayerRight(){
		this.#player_right = new pg_Paddle(this, "right", pg_gameConfig.width - pg_gameConfig.scene_play.player.distance_to_border, pg_gameConfig.height / 2, pg_gameConfig.scene_play.player.paddle_length, pg_gameConfig.scene_play.player.paddle_width, pg_gameConfig.scene_play.player.color.right, pg_gameConfig.scene_play.player.alpha.right);
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
		this.#setTwoPaddlesBounceAngleFunction();
		this.#setPaddleBotCalculousFunction();

		this.physics.add.collider(this.#balls, this.#paddles, (ball, paddle) => {
			paddle.BounceBall(ball, paddle);
			paddle.botCalculous();
		})
	}
		#setTwoPaddlesBounceAngleFunction(){
			this.#setPaddleToBallBounceReaction(this.#player_left);
			this.#setPaddleToBallBounceReaction(this.#player_right);
		}
			#setPaddleToBallBounceReaction(paddle){
				if (paddle.orientation === "left"){
					paddle.BounceBall = (ball, paddle) => {
						if (ball.x < paddle.getMiddleX()){
							ball.velocityY *= -1;
							return;
						}
						const normal_angle = 0;
						// const contact_point = ball.body.touching.paddle.y;
						const contact_point = ball.y;
						const relative_contact = this.#calculateRelativeContact(paddle, contact_point, paddle.getMiddleY());
						const bounce_angle = normal_angle + relative_contact * pg_gameConfig.scene_play.ball.max_bounce_angle;
						const new_velocity = ball.body.velocity.length() * pg_gameConfig.scene_play.ball.bounce_coefficient;
						this.physics.velocityFromAngle(bounce_angle, new_velocity, ball.body.velocity);
					}
				} else if (paddle.orientation === "right"){
					paddle.BounceBall = (ball, paddle) => {
						if (ball.x > paddle.getMiddleX()){
							ball.velocityY *= -1;
							return;
						}
						const normal_angle = 180;
						const contact_point = ball.y;
						const relative_contact = this.#calculateRelativeContact(paddle, contact_point, paddle.getMiddleY());
						const bounce_angle = normal_angle - relative_contact * pg_gameConfig.scene_play.ball.max_bounce_angle;
						const new_velocity = ball.body.velocity.length() * pg_gameConfig.scene_play.ball.bounce_coefficient;
						this.physics.velocityFromAngle(bounce_angle, new_velocity, ball.body.velocity);
					}

				} else if (paddle.orientation === "top"){
					paddle.BounceBall = (ball, paddle) => {
						if (ball.y < paddle.getMiddleY()){
							ball.velocityX *= -1;
							return;
						}
						const normal_angle = 270;
						const contact_point = ball.x;
						const relative_contact = this.#calculateRelativeContact(paddle, contact_point, paddle.getMiddleX());
						const bounce_angle = normal_angle + relative_contact * pg_gameConfig.scene_play.ball.max_bounce_angle;
						const new_velocity = ball.body.velocity.length() * pg_gameConfig.scene_play.ball.bounce_coefficient;
						this.physics.velocityFromAngle(bounce_angle, new_velocity, ball.body.velocity);
						
					}
				} else{ //paddle.orientation === "bottom"
					paddle.BounceBall = (ball, paddle) => {
						if (ball.y > paddle.getMiddleY()){
							ball.velocityX *= -1;
							return;
						}
						const normal_angle = 90;
						const contact_point = ball.x;
						const relative_contact = this.#calculateRelativeContact(paddle, contact_point, paddle.getMiddleX());
						const bounce_angle = normal_angle - relative_contact * pg_gameConfig.scene_play.ball.max_bounce_angle;
						const new_velocity = ball.body.velocity.length() * pg_gameConfig.scene_play.ball.bounce_coefficient;
						this.physics.velocityFromAngle(bounce_angle, new_velocity, ball.body.velocity);
					}
				}
			}
		#setPaddleBotCalculousFunction(){
			if (pg_gameMode.bot_level < 0){
				this.#player_left.botCalculous = ()=>{ return;};
				this.#player_right.botCalculous = ()=>{ return;};
			} else if (pg_gameMode.bot_level == 0){
				this.#player_right.botCalculous = ()=>{ return;};
				this.#player_left.botCalculous = () => { this.#player_right.targeted_y = this.#calculousBotPositionWithAI() };
			} else {
				this.#player_right.botCalculous = ()=>{ this.#player_right.targeted_y = this.#calculousRecenterBot() };
				this.#player_left.botCalculous = () => { this.#player_right.targeted_y = this.#calculousBotPositionWithAI() };
			}
		}
	
			#calculousRecenterBot(){
				const target_y = pg_gameConfig.height / 2
				return target_y;
			}
			#calculousGetImpactPoint(){
				//TODO
			}
			#calculousBotPositionWithAI(){
				let targeted_y;
				const impact_point = this.#calculousGetImpactPoint();
				//TODO ia model here, here random
				targeted_y = impact_point - pg_gameConfig.scene_play.player.paddle_length / 2 + Math.random(pg_gameConfig.scene_play.player.paddle_length + 1);
				return targeted_y;
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
		this.#setPlayerControlsKeys(this.#player_left, pg_gameConfig.scene_play.player.controls.left.up.key_code, pg_gameConfig.scene_play.player.controls.left.down.key_code);
		if (pg_gameMode.bot_level < 0){
			this.#setPlayerControlsKeys(this.#player_right, pg_gameConfig.scene_play.player.controls.right.up.key_code, pg_gameConfig.scene_play.player.controls.right.down.key_code);
		} else {
			this.#setBotControls(this.#player_right)
		}
	}
		#setPlayerControlsKeys(player, key_code_up, key_code_down){
			player.key_up = this.input.keyboard.addKey(key_code_up);
			player.key_down = this.input.keyboard.addKey(key_code_down);
			player.get_direction = this.#getPlayerDirection;
		}
		#getPlayerDirection(player){
			const key_up_pressed = player.key_up.isDown;
			const key_down_pressed = player.key_down.isDown;
			const player_vertical_direction = key_down_pressed - key_up_pressed;
			return player_vertical_direction;
		}
		#setBotControls(player){
			player.targeted_y = pg_gameConfig.height / 2;
			player.get_direction = this.#getBotDirection;
		}
		#getBotDirection(player){
			const direction = player.targeted_y - player.y;
			if (Math.abs(direction) <= pg_gameConfig.scene_play.bot.position_epsilon){
				player.y = player.targeted_y;
				return 0;
			} else if (direction > 0) {
				return 1;
			} else {
				return -1
			}
		}
	
	#newRound(){
		this.#ball = this.createBall();
		this.resetBall(this.#ball);
	}

	update(){
		this.#movePlayersManager();
		this.#clock.update();
		if (this.#isPartyFinished()){
			this.scene.start("pg_GameFinished", {boot_scene_textures : this.#boot_textures, scores: this.#scores, duration_ms: this.#clock.getPastTime()});
		}
	}

	#movePlayersManager(){
		this.#setPlayerVelocity(this.#player_left);
		this.#setPlayerVelocity(this.#player_right);
	}
	#setPlayerVelocity(player){
		const player_vertical_direction = player.get_direction(player);
		player.body.setVelocityY(pg_gameConfig.scene_play.player.max_speed * player_vertical_direction);
	}

	#isPartyFinished(){
		let party_finished = false;
		if (pg_gameMode.maxPoints > 0){
			party_finished |= this.#scores.left.greaterThan(pg_gameMode.maxPoints) || this.#scores.right.greaterThan(pg_gameMode.maxPoints);
		}
		if (pg_gameMode.maxTime > 0){
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