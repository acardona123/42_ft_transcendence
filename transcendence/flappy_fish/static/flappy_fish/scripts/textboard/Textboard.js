class Textboard extends Phaser.GameObjects.Container{
	#scene;
	#background;
	#score_player1;
	#score_player2;
	#clock;

	constructor(scene, texture_scene_background, texture_scene_death, texture_scene_player1, texture_scene_player2){
		super(scene, gameConfig.width / 2, gameConfig.textboard.height / 2);
		this.#scene = scene;

		this.#resize_textboard();
		this.#createComponents(texture_scene_background, texture_scene_death, texture_scene_player1, texture_scene_player2);
		this.#addComponentsToContainer();
		this.#positionComponents();
		this.#scene.add.existing(this);

	}
		#resize_textboard(){
			this.width = gameConfig.width;
			this.height = gameConfig.textboard.height;
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
					this.#score_player1 = new Score (this.#scene, player_index.PLAYER1, texture_scene_player1, false);
					this.#score_player2 = new Score (this.#scene, player_index.PLAYER2, texture_scene_player2, true);
				}
				else{
					this.#score_player1 = new Score (this.#scene, player_index.PLAYER1, texture_scene_death, false);
					this.#score_player2 = new Score (this.#scene, player_index.PLAYER2, texture_scene_death, true);
				}
			}
			#createClock(){
				this.#createClockObject();
				this.#resizeClock();
				this.#clock.setAlign('center');
				this.#clock.setOrigin(0.5, 0.5);
			}
				#createClockObject(){
					if (isTimeLimited()){
						this.#clock = new Timer(this.#scene, 0, 0, gameConfig.textboard.text_style, gameMode.maxTime);
					} else{
						this.#clock = new Chronometer(this.#scene, 0, 0, gameConfig.textboard.text_style)
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
			this.#score_player1.setPositionCenterLeft(gameConfig.textboard.side_padding - this.width / 2, 0);
			this.#clock.setPosition(0, 0);
			this.#score_player2.setPositionCenterRight(this.width / 2 - gameConfig.textboard.side_padding, 0);
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


}