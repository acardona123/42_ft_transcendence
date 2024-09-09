class SceneGameFinished extends Phaser.Scene{
	
	#score;
	#past_time;
	#victory_status;

	#boot_textures;
	#scene_textures;

	#background;
	#ceiling;
	#ground;
	#panel_player1;
	#panel_player2;
	#match_duration;

	constructor(){
		super("GameFinished");
	}

	init(data){
		this.#past_time = data.textboard.past_time;
		
		this.#initTextures(data.textures);
		this.#initScores(data.textboard);
		this.#initVictoryStatus();
	}
		#initTextures(textures){
			this.#boot_textures = textures;
			this.#scene_textures = textures.sceneGameOver;
			for (const [key, value] of Object.entries(this.#scene_textures)){
				value.transferToScene(this);
			}
		}
		#initScores(textboard){
			this.#score = {
				player1: textboard.score_player1,
				player2: textboard.score_player2,
			}
		}
		#initVictoryStatus(){
			this.#victory_status = {
				player1: this.#getPlayerWinningStatus(player_index.PLAYER1),
				player2: this.#getPlayerWinningStatus(player_index.PLAYER2),
			};

		}
			#getPlayerWinningStatus(player_index_symbol){
				const death_count_player1 = this.#calculateNumberOfDeath(this.#score.player1);
				const death_count_player2 = this.#calculateNumberOfDeath(this.#score.player2);
				const death_difference = death_count_player1 - death_count_player2;
				if (death_difference == 0){
					return (victory_status.TIE)
				} else {
					return (this.#hasPlayerWon(player_index_symbol, death_difference));
				}
			}
				#calculateNumberOfDeath(score){
					if (areLivesLimited()){
						return (gameMode.maxDeath - score);
					} else {
						return (score);
					}
				}
				#hasPlayerWon(player_index_symbol, death_difference){
					if (player_index_symbol === player_index.PLAYER1){
						return ((death_difference < 0) ? victory_status.WIN : victory_status.LOOSE);
					} else {
						return (death_difference > 0 ? victory_status.WIN : victory_status.LOOSE);
					}
				}

	
	create(){
		this.#createAnimations();
		this.#createBackground();
		this.#createGround();
		this.#createCeiling();
		this.#createPlayerPanels();
		this.#createMatchDurationDisplay();
	}

		#createAnimations(){
			for (const [key, value] of Object.entries(this.#scene_textures)){
				value.createAnimationOnScene();
			}
		}
		
		#createCeiling(){
			this.#ceiling = new GameFinishedCeiling(this.#scene_textures.ceiling);
		}

		#createBackground(){
			this.#background = new GameFinishedBackground(this.#scene_textures.background);
		}

		#createGround(){
			this.#ground = new GameFinishedGround(this.#scene_textures.ground);
		}

		#createPlayerPanels(){
			this.#createPlayerPanelsObjects();
			this.#positionPayerPanels();
		}
			#createPlayerPanelsObjects(){
				this.#panel_player1 = new PlayerRecapPanel(
					player_index.PLAYER1,
					this.#scene_textures.player1_icon,
					this.#scene_textures.confetti,
					this.#score.player1,
					this.#getPlayerWinningStatus(player_index.PLAYER1)
				);
				this.#panel_player2 = new PlayerRecapPanel(
					player_index.PLAYER2,
					this.#scene_textures.player2_icon,
					this.#scene_textures.confetti,
					this.#score.player2,
					this.#getPlayerWinningStatus(player_index.PLAYER2),
					true
				);
			}
			#positionPayerPanels(){
				this.#positionPayer1Panel();
				this.#positionPayer2Panel();
			}
				#positionPayer1Panel(){
					this.#panel_player1.setTopRightCornerPosition(0, gameConfig.scene_game_finished.ceiling.height + gameConfig.scene_game_finished.padding.top);
					const final_x = Math.floor(gameConfig.width / 4);
					this.#panelPositioningTween(this.#panel_player1, final_x, this.#victory_status.player1);
				}
				#positionPayer2Panel(){
					this.#panel_player2.setTopLeftCornerPosition(gameConfig.width, gameConfig.scene_game_finished.ceiling.height + gameConfig.scene_game_finished.padding.top);
					const final_x = Math.floor(3 * gameConfig.width / 4);
					this.#panelPositioningTween(this.#panel_player2, final_x, this.#victory_status.player2);
				}
					#panelPositioningTween(target, final_x, target_victory_status){
						this.tweens.add({
							targets: target,
							x: final_x,
							ease: 'Power1',
							duration: 1000,
							repeat: 0,
							onComplete: function(){
								if (target_victory_status === victory_status.WIN || target_victory_status === victory_status.TIE ) {
									target.playCelebrationTween();
								} else {
									target.playDefeatTween();
								}
							},
							callbackScope: this
						})
					}

		#createMatchDurationDisplay(){
			this.#match_duration = new MatchDurationDisplay(this, this.#past_time / 1000);
			const y = gameConfig.scene_game_finished.padding.under_panels + Math.max(this.#panel_player1.y + this.#panel_player1.height / 2, this.#panel_player2.y + this.#panel_player2.height / 2);
			this.#match_duration.setTopCenterPosition(gameConfig.width / 2, y)
		}

			
}