class fb_PlayerDescriptionPanel extends Phaser.GameObjects.Container{
	#scene;
	#player_index_symbol;
	#player_texture;
	#flip_icon;
	#text_style;

	#icon;
	#text_username;
	#text_controls;
	#components_array;

	constructor(
		player_index_symbol,
		player_scene_texture,
		flip_icon = (player_index_symbol === player_index.PLAYER2),
		text_style = fb_gameConfig.scene_menu.text_style
		){
		super(player_scene_texture.scene);

		this.#player_index_symbol = player_index_symbol;
		this.#player_texture = player_scene_texture;
		this.#flip_icon = flip_icon;
		this.#text_style = text_style;

		this.#scene = this.#player_texture.scene;

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
			this.#components_array = [this.#icon, this.#text_username, this.#text_controls];
		}

			#createIcon(){
				this.#createIconObject();
				this.#resizeIconObject();
				this.#playIconAnimation();
			}
				#createIconObject(){
					this.#icon = this.#player_texture.createOnScene(0,0);
					this.#icon.flipX = this.#flip_icon;
				}
				#resizeIconObject(){
					const scale_x = this.#player_texture.getScaleToTargetWidth(fb_gameConfig.scene_menu.panel.icon_size);
					const scale_y = this.#player_texture.getScaleToTargetHeight(fb_gameConfig.scene_menu.panel.icon_size);
					const scale = Math.min(scale_x, scale_y);
					this.#icon.setScale(scale);
				}
				#playIconAnimation(){
					this.#player_texture.playAnimationOn(this.#icon);
				}

			#createTextUsername(){
				const username = this.#getUsername();
				this.#text_username = this.#createTextObject(username);
			}
				#getUsername(){
					if (this.#player_index_symbol === player_index.PLAYER1){
						return (fb_gameMode.username_player1);
					} else {
						return (fb_gameMode.username_player2);
					}
				}

			#createTextControls(){
				const text_content = this.#createTextControlsContent();
				this.#text_controls = this.#createTextObject(text_content);
			}
				#createTextControlsContent(){
					let jump_key;
					if (this.#player_index_symbol === player_index.PLAYER1){
						jump_key = "SPACE";
					} else {
						jump_key = "ENTER"
					}
					return (`jump: ${jump_key}`);
				}

		#resizeContainer(){
			this.width = Math.max(fb_gameConfig.scene_menu.panel.icon_size, this.#text_username.width, this.#text_controls.width);
			this.height = fb_gameConfig.scene_menu.panel.icon_size + fb_gameConfig.scene_menu.panel.icon_bottom_padding
				+ this.#text_username.height + fb_gameConfig.scene_menu.panel.line_spacing
				+ this.#text_controls.height;
		}

		#addComponentsToContainer(){
			this.add(this.#components_array);
		}

		#positionComponents(){
			this.#setComponentsOrigins();
			this.#setComponentsPosition();
			this.depth = fb_gameConfig.scene_menu.depth.panel;
		}
			#setComponentsOrigins(){
				this.#icon.setOrigin(0.5, 0);
				this.#text_username.setOrigin(0.5, 0);
				this.#text_controls.setOrigin(0.5, 0);
			}
			#setComponentsPosition(){
				let y = -this.height / 2
				this.#icon.setPosition(0, y);
				y += fb_gameConfig.scene_menu.panel.icon_size + fb_gameConfig.scene_menu.panel.icon_bottom_padding;
				this.#text_username.setPosition(0, y);
				y +=  this.#text_username.height + fb_gameConfig.scene_menu.panel.icon_bottom_padding;
				this.#text_controls.setPosition(0, y);
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