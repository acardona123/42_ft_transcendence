class pg_PlayerDescriptionPanel extends Phaser.GameObjects.Container{
	#scene;
	#player_index_symbol;
	#player_icon_texture;
	#text_style;

	#icon;
	#text_username;
	#text_control_up;
	#text_control_down;
	#components_array;

	constructor(
		player_index_symbol,
		player_scene_texture,
		text_style = pg_gameConfig.scene_menu.text_style
		){
		super(player_scene_texture.scene);
		this.#scene = player_scene_texture.scene;
		this.#player_index_symbol = player_index_symbol;
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
			this.#createTextControls();
			this.#components_array = [this.#icon, this.#text_username, this.#text_control_up, this.#text_control_down];
		}

			#createIcon(){
				this.#icon = new Icon(this.#player_index_symbol, this.#player_icon_texture);
				this.#icon.tiltIcon();
			}

			#createTextUsername(){
				const username = this.#getUsername();
				this.#text_username = this.#createTextObject(username);
			}
				#getUsername(){
					if (this.#player_index_symbol === player_index.PLAYER1){
						return (pg_gameMode.username_player1);
					} else {
						return (pg_gameMode.username_player2);
					}
				}

			#createTextControls(){
				const controls = this.#getPlayerControls();
				this.#text_control_up = this.#createTextObject(`Up: ${controls.up.key_name}`);
				this.#text_control_down = this.#createTextObject(`Down: ${controls.down.key_name}`);
			}
				#getPlayerControls(){
					if (this.#player_index_symbol === player_index.PLAYER1){
						return (pg_gameConfig.scene_play.player.controls.left);
					} else {
						return (pg_gameConfig.scene_play.player.controls.right);
					}
				}

		#resizeContainer(){
			this.width = Math.max(pg_gameConfig.scene_menu.player_panel.icon_size, this.#text_username.width, this.#text_control_up.width, this.#text_control_down.width);
			this.height = pg_gameConfig.scene_menu.player_panel.icon_size
				+ pg_gameConfig.scene_menu.player_panel.icon_bottom_padding
				+ this.#text_username.height
				+ this.#text_control_up.height
				+ this.#text_control_down.height
				+ 2 * pg_gameConfig.scene_menu.player_panel.line_spacing;
		}

		#addComponentsToContainer(){
			this.add(this.#components_array);
		}

		#positionComponents(){
			this.#setComponentsOrigins();
			this.#setComponentsPosition();
			this.depth = pg_gameConfig.scene_menu.depths.player_panels;
		}
			#setComponentsOrigins(){
				this.#text_username.setOrigin(0.5, 0);
				this.#text_control_up.setOrigin(0.5, 0);
				this.#text_control_down.setOrigin(0.5, 0);
			}
			#setComponentsPosition(){
				let y = -this.height / 2
				this.#icon.setTopCenterPosition(0, y);
				y += pg_gameConfig.scene_menu.player_panel.icon_size + pg_gameConfig.scene_menu.player_panel.icon_bottom_padding;
				this.#text_username.setPosition(0, y);
				y +=  this.#text_username.height + pg_gameConfig.scene_menu.player_panel.line_spacing;
				this.#text_control_up.setPosition(0, y);
				y +=  this.#text_control_up.height + pg_gameConfig.scene_menu.player_panel.line_spacing;
				this.#text_control_down.setPosition(0, y);
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