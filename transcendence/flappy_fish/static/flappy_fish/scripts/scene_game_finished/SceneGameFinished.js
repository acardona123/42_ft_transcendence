class SceneGameFinished extends Phaser.Scene{
	
	#score;
	#past_time;
	#victory_status;

	#boot_textures;
	#scene_textures;

	#background;
	#ceiling;
	#floor;
	#panel_player1;
	#panel_player2;
	#confetti;

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
		this.#createConfetti();
		this.#createPlayerPanels();
	}

		#createAnimations(){
			for (const [key, value] of Object.entries(this.#scene_textures)){
				value.createAnimationOnScene();
			}
		}

		#createBackground(){

		}

		#createConfetti(){
			this.#confetti = {
				player1: false,
				player2: false
			}
		}

		#createPlayerPanels(){
			this.#createPlayerPanelsObjects();
			this.#positionPayerPanels();
		}
			#createPlayerPanelsObjects(){
				this.#panel_player1 = new GameOverPlayerData(player_index.PLAYER1, this.#scene_textures.player1_icon, this.#score.player1, this.#getPlayerWinningStatus(player_index.PLAYER1));
				this.#panel_player2 = new GameOverPlayerData(player_index.PLAYER2, this.#scene_textures.player2_icon, this.#score.player2, this.#getPlayerWinningStatus(player_index.PLAYER2), true);
			}
			#positionPayerPanels(){
				this.#positionPayer1Panel();
				this.#positionPayer2Panel();
			}
				#positionPayer1Panel(){
					this.#panel_player1.setTopRightCornerPosition(0, gameConfig.scene_game_finished.panel.top_padding);
					console.log(`y = ${this.#panel_player1.y}`)
					const final_x = Math.floor(gameConfig.width / 4);

					var tween = this.tweens.add({
						targets: this.#panel_player1,
						x: final_x,
						ease: 'Power1',
						duration: 1000,
						repeat: 0,
						onComplete: function(){
							if (this.#victory_status.player1 === victory_status.WIN || this.#victory_status.player1 === victory_status.TIE ) {
								this.#confetti.player1 = new Confetti(this.#scene_textures.confetti, final_x, this.#panel_player1.y);
							}
						},
						callbackScope: this
					})
				}
				#positionPayer2Panel(){
					this.#panel_player2.setTopLeftCornerPosition(gameConfig.width, gameConfig.scene_game_finished.panel.top_padding);
					const final_x = Math.floor(3 * gameConfig.width / 4);
					var tween = this.tweens.add({
						targets: this.#panel_player2,
						x: final_x,
						ease: 'Power1',
						duration: 1000,
						repeat: 0,
						onComplete: function(){
							if (this.#victory_status.player2 === victory_status.WIN || this.#victory_status.player2 === victory_status.TIE ) {
								this.#confetti.player2 = new Confetti(this.#scene_textures.confetti, final_x, this.#panel_player2.y);
							}
						},
						callbackScope: this
					})
				}
}