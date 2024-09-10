class BotDescriptionPanel extends Phaser.GameObjects.Container{
	#scene;
	#player_icon_texture;
	#text_style;

	#icon;
	#text_bot_name;
	#text_bot_level;
	#components_array;

	constructor(
		player_scene_texture,
		text_style = gameConfig.scene_menu.text_style
		){
		super(player_scene_texture.scene);
		this.#scene = player_scene_texture.scene;
		this.#player_icon_texture = player_scene_texture;
		this.#text_style = text_style;

		this.#scene = this.#player_icon_texture.scene;

		this.#addContainerToScene();
		this.#createComponents();
		this.#resizeContainer();
		this.#addComponentsToContainer();
		this.#positionComponents();
	}

		#addContainerToScene(){
			this.#scene.add.existing(this);
		}
		
		#createComponents(){
			this.#createIcon();
			this.#createTextUsername();
			this.#createTextBotLevel();
			this.#components_array = [this.#icon, this.#text_bot_name, this.#text_bot_level];
		}

			#createIcon(){
				this.#icon = new Icon(player_index.PLAYER2, this.#player_icon_texture);
			}

			#createTextUsername(){
				this.#text_bot_name = this.#createTextObject("Botzilla");
			}

			#createTextBotLevel(){
				this.#text_bot_level = this.#createTextObject(`Level: ${gameMode.bot_level}`);
			}

		#resizeContainer(){
			this.width = Math.max(gameConfig.scene_menu.player_panel.icon_size, this.#text_bot_name.width, this.#text_bot_level.width);
			this.height = gameConfig.scene_menu.player_panel.icon_size
				+ gameConfig.scene_menu.player_panel.icon_bottom_padding
				+ this.#text_bot_name.height
				+ this.#text_bot_level.height
				+ gameConfig.scene_menu.player_panel.line_spacing;
		}

		#addComponentsToContainer(){
			this.add(this.#components_array);
		}

		#positionComponents(){
			this.#setComponentsOrigins();
			this.#setComponentsPosition();
			this.depth = gameConfig.scene_menu.depths.player_panels;
		}
			#setComponentsOrigins(){
				this.#text_bot_name.setOrigin(0.5, 0);
				this.#text_bot_level.setOrigin(0.5, 0);
			}
			#setComponentsPosition(){
				let y = -this.height / 2
				this.#icon.setTopCenterPosition(0, y);
				y += gameConfig.scene_menu.player_panel.icon_size + gameConfig.scene_menu.player_panel.icon_bottom_padding;
				this.#text_bot_name.setPosition(0, y);
				y +=  this.#text_bot_name.height + gameConfig.scene_menu.player_panel.line_spacing;
				this.#text_bot_level.setPosition(0, y);
			}

		#createTextObject(text_content){
			return (this.#scene.add.text(0, 0, text_content, this.#text_style));
		}


	setTopCenterPosition(x, y){
		this.setPosition(x, y + this.height / 2);
	}
	
	setTopLeftCornerPosition(x, y){
		this.setPosition(x + this.width / 2, y + this.height / 2);
	}
	
	setTopRightCornerPosition(x, y){
		this.setPosition(x - this.width / 2, y + this.height / 2);
	}
}