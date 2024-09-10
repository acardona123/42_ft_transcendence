class SceneMenu extends Phaser.Scene{
	#boot_textures;
	#scene_textures;


	#background;
	#panel_player1;
	#panel_player2;
	#match_duration;
	#points_limitation;
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
}