class fb_Textboard extends Phaser.GameObjects.Container{
	#scene;
	#background;
	#score_player1;
	#score_player2;
	#clock;

	constructor(scene, texture_scene_background, texture_scene_death, texture_scene_player1, texture_scene_player2){
		super(scene, fb_gameConfig.width / 2, fb_gameConfig.scenePlay.textboard.height / 2);
		this.#scene = scene;
		this.depth = fb_gameConfig.scenePlay.depth.textboard;

		this.#resize_textboard();
		this.#createComponents(texture_scene_background, texture_scene_death, texture_scene_player1, texture_scene_player2);
		this.#addComponentsToContainer();
		this.#positionComponents();
		this.#scene.add.existing(this);

	}
		#resize_textboard(){
			this.width = fb_gameConfig.width;
			this.height = fb_gameConfig.scenePlay.textboard.height;
		}
		#createComponents(texture_scene_background, texture_scene_death, texture_scene_player1, texture_scene_player2){
			this.#createBackground(texture_scene_background);
			this.#createPlayersScores(texture_scene_death, texture_scene_player1, texture_scene_player2);
			this.#createClock();

		}
			#createBackground(texture_scene_background){
				this.#background = texture_scene_background.createTileSprite(0, 0, this.width, this.height);
				this.#background.setOrigin(0);
			}
			#createPlayersScores(texture_scene_death, texture_scene_player1, texture_scene_player2){
				if (areLivesLimited()){
					this.#score_player1 = new fb_Score (this.#scene, player_index.PLAYER1, texture_scene_player1, false);
					this.#score_player2 = new fb_Score (this.#scene, player_index.PLAYER2, texture_scene_player2, true);
				}
				else{
					this.#score_player1 = new fb_Score (this.#scene, player_index.PLAYER1, texture_scene_death, false);
					this.#score_player2 = new fb_Score (this.#scene, player_index.PLAYER2, texture_scene_death, true);
				}
			}
			#createClock(){
				this.#createClockObject();
				this.#resizeClock();
				this.#clock.setAlign('center');
				this.#clock.setOrigin(0.5, 0.5);
			}
				#createClockObject(){
					if (fb_isTimeLimited()){
						this.#clock = new fb_Timer(this.#scene, 0, 0, fb_gameConfig.scenePlay.textboard.text_style, fb_gameMode.maxTime);
					} else{
						this.#clock = new fb_Chronometer(this.#scene, 0, 0, fb_gameConfig.scenePlay.textboard.text_style)
					}
				}
				#resizeClock(){
					this.#clock.width = this.width / 3;
					this.#clock.height = this.height / this.height;
				}

		#addComponentsToContainer(){
			this.add([this.#background, this.#score_player1, this.#clock, this.#score_player2]);
		}
		#positionComponents(){
			this.#background.setPosition(-this.width / 2, - this.height / 2);
			this.#score_player1.setPositionCenterLeft(fb_gameConfig.scenePlay.textboard.side_padding - this.width / 2, 0);
			this.#clock.setPosition(0, 0);
			this.#score_player2.setPositionCenterRight(this.width / 2 - fb_gameConfig.scenePlay.textboard.side_padding, 0);
		}
		
		update(){
			this.#clock.update();
		}

		start(){
			this.#clock.start();
		}

		pause(){
			this.pauseClock.pause();
		}

		addDeath(player_index_symbol){
			if (player_index_symbol === player_index.PLAYER1){
				this.#score_player1.updatePlayerDied();
			} else {
				this.#score_player2.updatePlayerDied();
			}
		}
		
		getPlayerScore(player_index_symbol){
			if (player_index_symbol === player_index.PLAYER1){
				return (this.#score_player1.getScoreValue());
			} else {
				return (this.#score_player2.getScoreValue());
			}
		}

		doesPlayerHasRemainingLife(player_index_symbol){
			if (areLivesLimited()){
				if (player_index_symbol ===  player_index.PLAYER1){
					return (this.#score_player1.getScoreValue() > 0)
				} else {
					return (this.#score_player2.getScoreValue() > 0)
				}
			} else {
				return (true);
			}
		}

		isTimeOver(){
			if (fb_isTimeLimited()){
				return (this.#clock.isTimeOver());
			} else {
				return (false);
			}
		}

		getAllValues(){
			return ({
				score_player1: this.#score_player1.getScoreValue(),
				score_player2: this.#score_player2.getScoreValue(),
				past_time: this.#clock.getPastTime()
			})
		}

}