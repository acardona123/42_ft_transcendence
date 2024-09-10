class SceneMenu extends Phaser.Scene{
	#boot_textures;
	#scene_textures;


	#background;
	#panel_player1;
	#panel_player2;
	#time_limit;
	#points_limit;
	#start_button;

	constructor(){
		super ("Menu");
	}

	init (loaded_boot_textures){
		this.#boot_textures = loaded_boot_textures;
		this.#scene_textures = loaded_boot_textures.sceneMenu;
		for (const [key, value] of Object.entries(this.#scene_textures)){
			value.transferToScene(this);
		}	
	}

	create(){
		this.#createAnimations();
		this.#createBackground()
		this.#createPlayerDescriptionPanels();
		this.#createTimeLimit();
		this.#createPointsLimit();
		this.#createStartButton();
	}
		
	#createAnimations(){
		for (const [key, value] of Object.entries(this.#scene_textures)){
			value.createAnimationOnScene();
		}		
	}

	#createBackground(){
		this.#background = new MenuBackground (this.#scene_textures.background);
	}

	#createPlayerDescriptionPanels(){
		this.#createPlayerPanelsObjects();
		this.#positionPayerPanels();
	}
		#createPlayerPanelsObjects(){
			this.#panel_player1 = new PlayerDescriptionPanel(
				player_index.PLAYER1,
				this.#scene_textures.player_icon
			);
			this.#panel_player2 = new PlayerDescriptionPanel(
				player_index.PLAYER2,
				this.#scene_textures.player_icon
			);
		}
		#positionPayerPanels(){
			this.#positionPayer1Panel();
			this.#positionPayer2Panel();
		}
			#positionPayer1Panel(){
				const x = Math.floor(gameConfig.width / 4);
				const y = gameConfig.scene_menu.padding.top;
				this.#panel_player1.setTopCenterPosition(x, y);
				
			}
			#positionPayer2Panel(){
				const x =Math.floor(3 * gameConfig.width / 4);
				const y = gameConfig.scene_menu.padding.top;
				this.#panel_player2.setTopCenterPosition(x, y);
			}

		#createTimeLimit(){
			this.#time_limit = new EntitledTimeDisplay(this, "Time limit", gameMode.maxTime, gameConfig.scene_menu.text_style, gameConfig.scene_menu.depths.time_limit);
			const x = gameConfig.width / 2;
			const y = Math.max(this.#panel_player1.y + this.#panel_player1.height / 2, this.#panel_player2.y + this.#panel_player2.height / 2) + gameConfig.scene_menu.padding.under_panels;
			this.#time_limit.setTopCenterPosition(x, y)
		}

		#createPointsLimit(){
			const deaths_limit_content = `Points limit: ${(gameMode.maxPoints < 0) ? "∞" : gameMode.maxPoints}`;
			this.#points_limit = this.add.text(0, 0, deaths_limit_content, gameConfig.scene_menu.text_style);
			this.#positionDeathsLimit();
		}
			#positionDeathsLimit(){
				this.#points_limit.setOrigin(0.5, 0);
				const x = gameConfig.width / 2;
				const y = this.#time_limit.y + this.#time_limit.height / 2 + gameConfig.scene_menu.padding.under_time_limit;
				this.#points_limit.setPosition(x, y);
			}
		
		#createStartButton(){
			this.#start_button = new Button(this, "START", gameConfig.scene_menu.button_style);
			this.#positionButton();
			this.#setButtonInteraction();
		}
			#positionButton(){
				const x = gameConfig.width / 2;
				const y = gameConfig.height - gameConfig.scene_menu.padding.under_button;
				this.#start_button.setBottomCenterPosition(x, y);
				this.#start_button.depth = gameConfig.scene_menu.depths.button
			}
			#setButtonInteraction(){
				this.#start_button.on('pointerdown', () => {this.#startGame();});
			}

		#startGame(){
			this.scene.start("PlayGame", this.#boot_textures);
		}
}
