class pg_SceneGameFinished extends Phaser.Scene{
	
	#score;
	#past_time;
	#victory_status;

	#boot_textures;
	#scene_textures;

	#background;
	#panel_player1;
	#panel_player2;
	#match_duration;
	#quit_button;

	constructor(){
		super(pg_gameConfig.scene_game_finished.name);
	}

	init(data){
		this.#past_time = data.duration_ms;
		
		this.#initTextures(data.boot_scene_textures);
		this.#initScores(data.scores);
		this.#initVictoryStatus();
	}
		#initTextures(textures){
			this.#boot_textures = textures;
			this.#scene_textures = textures.sceneGameOver;
			for (const [key, value] of Object.entries(this.#scene_textures)){
				value.transferToScene(this);
			}
		}
		#initScores(score){
			this.#score = {
				player1: score.left,
				player2: score.right,
			}
		}
		#initVictoryStatus(){
			this.#victory_status = {
				player1: this.#getPlayerWinningStatus(player_index.PLAYER1),
				player2: this.#getPlayerWinningStatus(player_index.PLAYER2),
			};

		}
			#getPlayerWinningStatus(player_index_symbol){
				const player1_points = this.#score.player1.getScore();
				const player2_points = this.#score.player2.getScore();
				const points_diff = player1_points - player2_points;
				return (this.#hasPlayerWon(player_index_symbol, points_diff));
			}
				#hasPlayerWon(player_index_symbol, points_diff){
					if (points_diff == 0){
						return (victory_status.TIE);
					} else if (player_index_symbol === player_index.PLAYER1){
						return ((points_diff > 0) ? victory_status.WIN : victory_status.LOOSE);
					} else {
						return (points_diff < 0 ? victory_status.WIN : victory_status.LOOSE);
					}
				}

	
	create(){
		this.#createAnimations();
		this.#createBackground();
		this.#createPlayerPanels();
		this.#createMatchDurationDisplay();
		this.#createQuitButton();
	}

		#createAnimations(){
			for (const [key, value] of Object.entries(this.#scene_textures)){
				value.createAnimationOnScene();
			}
		}

		#createBackground(){
			this.#background = new pg_GameFinishedBackground(this.#scene_textures.background);
		}

		#createPlayerPanels(){
			this.#createPlayerPanelsObjects();
			this.#positionPayerPanels();
		}
			#createPlayerPanelsObjects(){
				this.#panel_player1 = new pg_PlayerRecapPanel(
					player_index.PLAYER1,
					this.#scene_textures.player_icon,
					this.#scene_textures.confetti,
					this.#score.player1.getScore(),
					this.#getPlayerWinningStatus(player_index.PLAYER1)
				);
				this.#panel_player2 = new pg_PlayerRecapPanel(
					player_index.PLAYER2,
					(pg_gameMode.bot_level < 0) ? this.#scene_textures.player_icon : this.#scene_textures.bot_icon,
					this.#scene_textures.confetti,
					this.#score.player2.getScore(),
					this.#getPlayerWinningStatus(player_index.PLAYER2)
				);
			}
			#positionPayerPanels(){
				this.#positionPayer1Panel();
				this.#positionPayer2Panel();
			}
				#positionPayer1Panel(){
					this.#panel_player1.setTopRightCornerPosition(0, pg_gameConfig.scene_game_finished.padding.top);
					const final_x = Math.floor(pg_gameConfig.width / 4);
					this.#panelPositioningTween(this.#panel_player1, final_x, this.#victory_status.player1);
				}
				#positionPayer2Panel(){
					this.#panel_player2.setTopLeftCornerPosition(pg_gameConfig.width, pg_gameConfig.scene_game_finished.padding.top);
					const final_x = Math.floor(3 * pg_gameConfig.width / 4);
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
			this.#match_duration = new EntitledTimeDisplay(this, "Match duration", this.#past_time / 1000, pg_gameConfig.scene_game_finished.text_style, pg_gameConfig.scene_game_finished.depths.match_duration);
			const y = pg_gameConfig.scene_game_finished.padding.under_panels + Math.max(this.#panel_player1.y + this.#panel_player1.height / 2, this.#panel_player2.y + this.#panel_player2.height / 2);
			this.#match_duration.setTopCenterPosition(pg_gameConfig.width / 2, y);
		}

		#createQuitButton(){
			this.#quit_button = new Button(this, "Home", pg_gameConfig.scene_game_finished.button_style);
			this.#positionButton();
			this.#setButtonInteraction();
		}
			#positionButton(){
				const x = pg_gameConfig.width / 2;
				const y = this.#match_duration.y + this.#match_duration.height / 2 +  pg_gameConfig.scene_game_finished.padding.under_match_duration;
				this.#quit_button.setTopCenterPosition(x, y);
				this.#quit_button.depth = pg_gameConfig.scene_game_finished.depths.button;
			}
			#setButtonInteraction(){
				if (pg_gameMode.tournament_id < 0)
					this.#quit_button.on('pointerdown', () => {this.#goBackHome();});
					else
				this.#quit_button.on('pointerdown', () => {this.#continueTournament();});
			}
			#goBackHome(){
				console.log("Go back to home");
				close_modal('modal-game', reset_game);
				//TODO
			}
			#continueTournament(){
				console.log("Continue the tournament");
			}
}
