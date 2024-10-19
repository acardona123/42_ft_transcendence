class pg_ScenePlay extends Phaser.Scene{

	#boot_textures;
	#scene_textures;

	//objects
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

	//bot_calculous

	#bot;

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
		var tween = this.tweens.add({
			targets: ball,
			ease: 'Power1',
			alpha: old_alpha,
			duration: 1500,
			repeat: 0,
			onComplete: function(){
				const random_trajectory_angle = Phaser.Math.Between(90 - pg_gameConfig.scene_play.ball.max_bounce_angle, -90 + pg_gameConfig.scene_play.ball.max_bounce_angle) + (Math.random() < 0.5 ? 180: 0);
				this.physics.velocityFromAngle(random_trajectory_angle, pg_gameConfig.scene_play.ball.init_velocity, ball.body.velocity);
				if (pg_gameMode.bot_level >= 0 && ball.body.velocity.x >= 0) {
					this.#player_left.botCalculous();
				}
			},
			callbackScope: this
		})
	}

	#createPlayers(){
		this.#createPlayerLeft();
		this.#createPlayerRight();
		this.#initiateBot();
	}
	#createPlayerLeft(){
		this.#player_left = new pg_Paddle(this, "left", pg_gameConfig.scene_play.player.distance_to_border, pg_gameConfig.height / 2, pg_gameConfig.scene_play.player.paddle_length, pg_gameConfig.scene_play.player.paddle_width, pg_gameConfig.scene_play.player.color.left, pg_gameConfig.scene_play.player.alpha.left);
		
	}
	#createPlayerRight(){
		this.#player_right = new pg_Paddle(this, "right", pg_gameConfig.width - pg_gameConfig.scene_play.player.distance_to_border, pg_gameConfig.height / 2, pg_gameConfig.scene_play.player.paddle_length, pg_gameConfig.scene_play.player.paddle_width, pg_gameConfig.scene_play.player.color.right, pg_gameConfig.scene_play.player.alpha.right);
	}
	#initiateBot(){
		if (pg_gameMode.bot_level < 0){
			this.#bot = {
				is_active: false
			};
		} else {
			this.#bot = {
				is_active: true,
				do_recenter: (pg_gameMode.bot_level > 0),
				t_last_action: 0,
				t_next_calculous: 0,
				pending: false,
			};
		}
	}


	#createInteractions(){
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
				if (! this.#bot.is_active){
					this.#player_left.botCalculous = ()=>{ return;};
					this.#player_right.botCalculous = ()=>{ return;};
					return;
				}
				this.#resetBotCalculousData();
				this.#player_right.botCalculous = ()=>{
					if (!this.#bot.is_active){
						return;
					}
					this.#bot.pending = false;
					if (!this.#bot.do_recenter){
						return;
					}
					const t_now = this.time.now;
					if (t_now - this.#bot.t_last_action >= pg_gameConfig.scene_play.bot.calculous_period_min * 1.1){
						this.#bot.t_last_action = t_now;
						this.#player_right.targeted_y = this.#calculousRecenterBot()
					} else {
						this.#bot.do_recenter = false;
					}
				};
				this.#player_left.botCalculous = () => {
					const t_now = this.time.now;
					if (t_now - this.#bot.t_last_action >= pg_gameConfig.scene_play.bot.calculous_period_min){

						this.#bot.t_last_action = t_now;
						this.#bot.pending = false;
						this.#player_right.targeted_y = this.#calculousBotPositionWithAI();
					} else {
						this.#bot.do_recenter = false;
						this.#bot.pending = true;
						this.#bot.t_next_calculous = this.#bot.t_last_action + pg_gameConfig.scene_play.bot.calculous_period_min;
					}
				};
			}
			#resetBotCalculousData(){
				this.#bot.t_last_action = this.time.now - 2000;
				this.#bot.pending = false;
				if (pg_gameMode.bot_level == 0){
					this.#bot.do_recenter = false;
				} else {
					this.#bot.do_recenter = true;
				}
			}
			#calculousRecenterBot(){
				const target_y = pg_gameConfig.height / 2
				return target_y;
			}
			#calculousGetImpactPoint(){
				const impact_point_x = pg_gameConfig.width - pg_gameConfig.scene_play.player.distance_to_border - this.#ball.radius;
				let rectilinear_projection_y;
				rectilinear_projection_y = this.#ball.y + (impact_point_x - this.#ball.x) * this.#ball.body.velocity.y / this.#ball.body.velocity.x;

				let impact_point_y;
				const limit_border_thickness = pg_gameConfig.scene_play.border.thickness + this.#ball.radius;
				const gameboard_height = pg_gameConfig.height - 2 * limit_border_thickness;; 
				const onboard_y = rectilinear_projection_y - limit_border_thickness;
					let bounces_counts;
				let remainder;
				if (onboard_y >= 0){
					bounces_counts = Math.floor(onboard_y / gameboard_height);
					remainder = onboard_y - gameboard_height * bounces_counts;
				} else {
					const reference_y = - onboard_y
					bounces_counts = Math.floor(reference_y / gameboard_height);
					remainder = reference_y - gameboard_height * bounces_counts;
				}
				if (bounces_counts % 2){
					impact_point_y = pg_gameConfig.height - limit_border_thickness - remainder;
				} else {
					impact_point_y = limit_border_thickness + remainder;
				}
				return (impact_point_y)
			}
			#calculousBotPositionWithAI(){
				let targeted_y;
				const impact_point_y = this.#calculousGetImpactPoint();
				// TODO: random position for now
				targeted_y = impact_point_y - pg_gameConfig.scene_play.player.paddle_length / 2 + Math.random() * (pg_gameConfig.scene_play.player.paddle_length);
				return targeted_y;
			}



	#createPlayerBordersCollisions()
	{
		// this.physics.add.collider(this.#paddles, this.#bounce_borders);
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
			const direction = player.targeted_y - player.getCenterPositionY();
			if (Math.abs(direction) <= pg_gameConfig.scene_play.bot.position_epsilon){
				player.setCenterPositionY(player.targeted_y);
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
		this.#resetBotCalculousData();
	}

	update(){
		this.#timeConditionedBotCalculous();
		this.#movePlayersManager();
		this.#clock.update();
		if (this.#isPartyFinished()){
			this.#finishParty();
		}
	}
	#timeConditionedBotCalculous(){
		if (!this.#bot.is_active) {
			return;
		}
		if (!this.#bot.pending || this.scene.now < this.#bot.t_next_calculous){
			return;
		}
		this.#player_left.botCalculous();
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

	async #finishParty(){
		this.scene.pause();
		await this.#sendMatchResults();
		this.#launchEndScene();
	}
		async #sendMatchResults(){
			const url = "/api/matches/finish/" + pg_gameMode.match_id + "/";
			const match_results = {
				"score1": this.#scores.left.getScore(),
				"score2": this.#scores.right.getScore(),
				"duration": this.#clock.getPastTime() / 1000
			}
			try
			{
				let fetched_data = await fetch_with_token(url, {
					method: 'POST',
					headers: {'content-type': 'application/json'},
					body: JSON.stringify(match_results)
				});
				if (!fetched_data.ok)
				{
					throw new Error("");
				}
			}
			catch (error)
			{

				create_popup("Error while trying to save the match results. Match cancelled", 10000, 4000, HEX_RED, HEX_RED_HOVER)
				// =====================================================================================
				// retour a la page d'accueil ????
				// =====================================================================================
			}
		}
		#launchEndScene(){
			this.scene.start("pg_GameFinished", {boot_scene_textures : this.#boot_textures, scores: this.#scores, duration_ms: this.#clock.getPastTime()});
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