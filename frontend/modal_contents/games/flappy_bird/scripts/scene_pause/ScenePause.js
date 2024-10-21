class fb_ScenePause extends Phaser.Scene{

	#boot_textures;
	#scene_textures;

	#background;
	#pause_text;
	#resume_button;
	#finish_button;
	#resume_key;


	constructor(){
		super("Pause");
	}

	init(loaded_boot_textures){
		this.#boot_textures = loaded_boot_textures;
		this.#scene_textures = loaded_boot_textures.scenePause;
		for (const [key, value] of Object.entries(this.#scene_textures)){
			value.transferToScene(this);
		}
	}

	create(){
		this.#createBackground();
		this.#createContentObjects()
		this.scene.launch('fb_playGame', this.#boot_textures);
		this.scene.sleep();
	}

		#createBackground(){
			this.#background = new fb_PauseBackground(this.#scene_textures.background);
		}

		#createContentObjects(){
			let x = fb_gameConfig.width / 2;
			let y = fb_gameConfig.scene_pause.padding.top;
			this.#createPauseText(x, y);
			y += this.#pause_text.height + fb_gameConfig.scene_pause.padding.under_text;
			this.#createResumeButton(x, y);
			y += this.#resume_button.height + fb_gameConfig.scene_pause.padding.between_buttons;
			this.#createFinishGameButton(x, y);
		}

			#createPauseText(x, y){
				const text_content = "-- PAUSE --";
				const text_style = fb_gameConfig.scene_pause.text_style;
				this.#pause_text = this.add.text(x, y, text_content, text_style);
				this.#pause_text.depth = fb_gameConfig.scene_pause.depths.text;
				this.#pause_text.setOrigin(0.5, 0);
			}

			#createResumeButton(x, y){
				this.#resume_button = new Button(this, "Resume (Esc)", fb_gameConfig.scene_pause.button_style);
				this.#positionResumeButton(x, y);
				this.#setResumeButtonInteraction();
			}
				#positionResumeButton(x, y){
					this.#resume_button.setTopCenterPosition(x, y);
					this.#resume_button.depth = fb_gameConfig.scene_pause.depths.buttons;
				}
				#setResumeButtonInteraction(){
					this.#resume_button.on('pointerdown', () => {this.#resumeGame();});
				}

			#createFinishGameButton(x, y){
				this.#finish_button = new Button(this, "Quit", fb_gameConfig.scene_pause.button_style);
				this.#positionFinishButton(x, y);
				this.#setFinishButtonInteraction();
			}
				#positionFinishButton(x, y){
					this.#finish_button.setTopCenterPosition(x, y);
					this.#finish_button.depth = fb_gameConfig.scene_pause.depths.buttons;
				}
				#setFinishButtonInteraction(){
					this.#finish_button.on('pointerdown', () => {this.#finishGame();});
				}

	#resumeGame(){
		this.scene.sleep();
		this.scene.run('fb_playGame');
	}

	#finishGame(){
		this.scene.run('fb_playGame');
		this.scene.sleep();
		custom_event.emit(event_stop_game);
	}

	update(){
	}
}