class fb_SceneMenu extends Phaser.Scene{
	
	#boot_textures;
	#scene_textures;

	#background;
	#ceiling;
	#ground;
	#panel_player1;
	#panel_player2;
	#match_duration;
	#deaths_limitation;
	#start_button;

	constructor(){
		super("fb_Menu");
	}

	init(boot_textures){
		this.#initTextures(boot_textures);
	}
		#initTextures(textures){
			this.#boot_textures = textures;
			this.#scene_textures = textures.sceneMenu;
			for (const [key, value] of Object.entries(this.#scene_textures)){
				value.transferToScene(this);
			}
		}

	
	create(){
		this.#createAnimations();
		this.#createBackground();
		this.#createGround();
		this.#createCeiling();
		this.#createPlayerPanels();
		this.#createTimeLimit();
		this.#createDeathsLimit();
		this.#createStartButton();
	}

		#createAnimations(){
			for (const [key, value] of Object.entries(this.#scene_textures)){
				value.createAnimationOnScene();
			}
		}
		
		#createCeiling(){
			this.#ceiling = new fb_MenuCeiling(this.#scene_textures.ceiling);
		}

		#createBackground(){
			this.#background = new fb_MenuBackground(this.#scene_textures.background);
		}

		#createGround(){
			this.#ground = new fb_MenuGround(this.#scene_textures.ground);
		}

		#createPlayerPanels(){
			this.#createPlayerPanelsObjects();
			this.#positionPayerPanels();
		}
			#createPlayerPanelsObjects(){
				this.#panel_player1 = new fb_PlayerDescriptionPanel(
					player_index.PLAYER1,
					this.#scene_textures.player1_icon
				);
				this.#panel_player2 = new fb_PlayerDescriptionPanel(
					player_index.PLAYER2,
					this.#scene_textures.player2_icon
				);
			}
			#positionPayerPanels(){
				this.#positionPayer1Panel();
				this.#positionPayer2Panel();
			}
				#positionPayer1Panel(){
					const x = Math.floor(fb_gameConfig.width / 4);
					const y = fb_gameConfig.scene_menu.ceiling.height + fb_gameConfig.scene_menu.padding.top;
					this.#panel_player1.setTopCenterPosition(x, y);
					
				}
				#positionPayer2Panel(){
					const x =Math.floor(3 * fb_gameConfig.width / 4);
					const y = fb_gameConfig.scene_menu.ceiling.height + fb_gameConfig.scene_menu.padding.top;
					this.#panel_player2.setTopCenterPosition(x, y);
				}

		#createTimeLimit(){
			this.#match_duration = new EntitledTimeDisplay(this, "Time limit", fb_gameMode.maxTime, fb_gameConfig.scene_menu.text_style, fb_gameConfig.scene_menu.depth.match_duration);
			const x = fb_gameConfig.width / 2;
			const y = Math.max(this.#panel_player1.y + this.#panel_player1.height / 2, this.#panel_player2.y + this.#panel_player2.height / 2) + fb_gameConfig.scene_menu.padding.under_panels;
			this.#match_duration.setTopCenterPosition(x, y);
		}


		#createDeathsLimit(){
			const deaths_limit_content = `Deaths limit: ${(fb_gameMode.maxDeath < 0) ? "∞" : fb_gameMode.maxDeath}`;
			this.#deaths_limitation = this.add.text(0, 0, deaths_limit_content, fb_gameConfig.scene_menu.text_style);
			this.#positionDeathsLimit();
		}
			#positionDeathsLimit(){
				this.#deaths_limitation.setOrigin(0.5, 0);
				const x = fb_gameConfig.width / 2;
				const y = this.#match_duration.y + this.#match_duration.height / 2 + fb_gameConfig.scene_menu.padding.under_time_limit;
				this.#deaths_limitation.setPosition(x, y);
				this.#deaths_limitation.depth = fb_gameConfig.scene_menu.depth.death_limit;
			}

		#createStartButton(){
			this.#start_button = new Button(this, "START", fb_gameConfig.scene_menu.button_style);
			this.#positionButton();
			this.#setButtonInteraction();
		}
			#positionButton(){
				const x = fb_gameConfig.width / 2;
				const y = fb_gameConfig.height - fb_gameConfig.scene_menu.ground.height - fb_gameConfig.scene_menu.padding.under_deaths_limit;
				this.#start_button.setBottomCenterPosition(x, y);
				this.#start_button.depth = fb_gameConfig.scene_menu.depth.button
			}
			#setButtonInteraction(){
				this.#start_button.on('pointerdown', () => {this.#startGame();});
			}

		#startGame(){
			this.scene.start("playGame", this.#boot_textures);
		}
}