class fb_SceneGameFinished extends Phaser.Scene{
	
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
	#quit_button;

	constructor(){
		super(fb_gameConfig.scene_game_finished.name);
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
						return (fb_gameMode.maxDeath - score);
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
		this.#createQuitButton();
	}

		#createAnimations(){
			for (const [key, value] of Object.entries(this.#scene_textures)){
				value.createAnimationOnScene();
			}
		}
		
		#createCeiling(){
			this.#ceiling = new fb_GameFinishedCeiling(this.#scene_textures.ceiling);
		}

		#createBackground(){
			this.#background = new fb_GameFinishedBackground(this.#scene_textures.background);
		}

		#createGround(){
			this.#ground = new fb_GameFinishedGround(this.#scene_textures.ground);
		}

		#createPlayerPanels(){
			this.#createPlayerPanelsObjects();
			this.#positionPayerPanels();
		}
			#createPlayerPanelsObjects(){
				this.#panel_player1 = new fb_PlayerRecapPanel(
					player_index.PLAYER1,
					this.#scene_textures.player1_icon,
					this.#scene_textures.confetti,
					this.#score.player1,
					this.#getPlayerWinningStatus(player_index.PLAYER1)
				);
				this.#panel_player2 = new fb_PlayerRecapPanel(
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
					this.#panel_player1.setTopRightCornerPosition(0, fb_gameConfig.scene_game_finished.ceiling.height + fb_gameConfig.scene_game_finished.padding.top);
					const final_x = Math.floor(fb_gameConfig.width / 4);
					this.#panelPositioningTween(this.#panel_player1, final_x, this.#victory_status.player1);
				}
				#positionPayer2Panel(){
					this.#panel_player2.setTopLeftCornerPosition(fb_gameConfig.width, fb_gameConfig.scene_game_finished.ceiling.height + fb_gameConfig.scene_game_finished.padding.top);
					const final_x = Math.floor(3 * fb_gameConfig.width / 4);
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
			this.#match_duration = new EntitledTimeDisplay(this, "Match duration", this.#past_time / 1000, fb_gameConfig.scene_game_finished.text_style, fb_gameConfig.scene_game_finished.depth.match_duration);
			const y = fb_gameConfig.scene_game_finished.padding.under_panels + Math.max(this.#panel_player1.y + this.#panel_player1.height / 2, this.#panel_player2.y + this.#panel_player2.height / 2);
			this.#match_duration.setTopCenterPosition(fb_gameConfig.width / 2, y);
		}

		#createQuitButton(){
			this.#quit_button = new Button(this, this.#getButtonContent(), fb_gameConfig.scene_game_finished.button_style);
			this.#positionButton();
			this.#setButtonInteraction();
		}
			#getButtonContent(){
				if (fb_gameMode.tournament_id < 0){
					return "Quit";
				} else {
					return "Next";
				}
			}
			#positionButton(){
				const x = fb_gameConfig.width / 2;
				const y = fb_gameConfig.height - fb_gameConfig.scene_game_finished.ground.height - fb_gameConfig.scene_game_finished.padding.under_match_duration;
				this.#quit_button.setBottomCenterPosition(x, y);
				this.#quit_button.depth = fb_gameConfig.scene_game_finished.depth.button;
			}
			#setButtonInteraction(){
				if (fb_gameMode.tournament_id < 0)
					this.#quit_button.on('pointerdown', async () => {await this.#goBackHome();});
					else
				this.#quit_button.on('pointerdown', async () => {await this.#continueTournament();});
			}
				async #goBackHome(){
					await stop_current_game();
					close_modal('modal-game', reset_game, false);
				}
				async #continueTournament(){
					await stop_current_game();
					try {
						continue_tournament_round();
					} catch {
						alert("Sorry but it was impossible to continue the round. The tournament has been canceled.");
						close_modal('modal-game', reset_game, false);
					}
				}
}
