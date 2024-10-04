class pg_SceneMenu extends Phaser.Scene{
	#boot_textures;
	#scene_textures;

	#background;
	#panel_player1;
	#panel_player2;
	#time_limit;
	#points_limit;
	#start_button;

	constructor(){
		super ("pg_Menu");
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
		this.#background = new pg_MenuBackground (this.#scene_textures.background);
	}

	#createPlayerDescriptionPanels(){
		this.#createPlayerPanelsObjects();
		this.#positionPayerPanels();
	}
		#createPlayerPanelsObjects(){
			this.#panel_player1 = new pg_PlayerDescriptionPanel(
				player_index.PLAYER1,
				this.#scene_textures.player_icon
			);
			if (pg_gameMode.bot_level < 0){
				this.#panel_player2 = new pg_PlayerDescriptionPanel(
					player_index.PLAYER2,
					this.#scene_textures.player_icon
				);
			} else {
				this.#panel_player2 = new pg_BotDescriptionPanel(this.#scene_textures.bot_icon);
			}
		}
		#positionPayerPanels(){
			this.#positionPayer1Panel();
			this.#positionPayer2Panel();
		}
			#positionPayer1Panel(){
				const x = Math.floor(pg_gameConfig.width / 4);
				const y = pg_gameConfig.scene_menu.padding.top;
				this.#panel_player1.setTopCenterPosition(x, y);
				
			}
			#positionPayer2Panel(){
				const x =Math.floor(3 * pg_gameConfig.width / 4);
				const y = pg_gameConfig.scene_menu.padding.top;
				this.#panel_player2.setTopCenterPosition(x, y);
			}

		#createTimeLimit(){
			this.#time_limit = new EntitledTimeDisplay(this, "Time limit", pg_gameMode.maxTime, pg_gameConfig.scene_menu.text_style, pg_gameConfig.scene_menu.depths.time_limit);
			const x = pg_gameConfig.width / 2;
			const y = Math.max(this.#panel_player1.y + this.#panel_player1.height / 2, this.#panel_player2.y + this.#panel_player2.height / 2) + pg_gameConfig.scene_menu.padding.under_panels;
			this.#time_limit.setTopCenterPosition(x, y)
				this.#time_limit.depth = pg_gameConfig.scene_menu.depths.time_limit;
		}

		#createPointsLimit(){
			const deaths_limit_content = `Points limit: ${(pg_gameMode.maxPoints < 0) ? "∞" : pg_gameMode.maxPoints}`;
			this.#points_limit = this.add.text(0, 0, deaths_limit_content, pg_gameConfig.scene_menu.text_style);
			this.#positionPointsLimit();
		}
			#positionPointsLimit(){
				this.#points_limit.setOrigin(0.5, 0);
				const x = pg_gameConfig.width / 2;
				const y = this.#time_limit.y + this.#time_limit.height / 2 + pg_gameConfig.scene_menu.padding.under_time_limit;
				this.#points_limit.setPosition(x, y);
				this.#points_limit.depth = pg_gameConfig.scene_menu.depths.points_limit;
			}
		
		#createStartButton(){
			this.#start_button = new Button(this, "START", pg_gameConfig.scene_menu.button_style);
			this.#positionButton();
			this.#setButtonInteraction();
		}
			#positionButton(){
				const x = pg_gameConfig.width / 2;
				const y = pg_gameConfig.height - pg_gameConfig.scene_menu.padding.under_button;
				this.#start_button.setBottomCenterPosition(x, y);
				this.#start_button.depth = pg_gameConfig.scene_menu.depths.button
			}
			#setButtonInteraction(){
				this.#start_button.on('pointerdown', () => {this.#startGame();});
			}

		#startGame(){
			this.scene.start("PlayGame", this.#boot_textures);
		}
}
