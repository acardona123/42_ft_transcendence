class Icon extends Phaser.GameObjects.Container {

	#scene;
	#player_index_symbol;
	#scene_texture;
	#size;

	#icon_image;
	#background;
	#components_array;

	constructor(player_index_symbol, scene_icon_texture){
		super (scene_icon_texture.scene);
		this.#scene = scene_icon_texture.scene;
		this.#player_index_symbol = player_index_symbol;
		this.#scene_texture = scene_icon_texture;
		this.#size = gameConfig.scene_menu.player_panel.icon_size;

		this.#addContainerToScene();
		this.#createComponents();
		this.#resizeContainer();
		this.#addComponentsToContainer();
		this.#positionComponents();
		this.#rotate_icon();
	}

	#addContainerToScene(){
		this.#scene.add.existing(this);
	}
	
	#createComponents(){
		this.#createIconImage();
		this.#createBackground();
		this.#components_array = [this.#background, this.#icon_image];
	}
		#createIconImage(){
			this.#icon_image = this.#scene_texture.createOnScene();
			this.#resizeIconImage();
			this.#scene_texture.playAnimationOn(this.#icon_image);
		}
			#resizeIconImage(){
				const scale = this.#scene_texture.getScaleToFit(this.#size, this.#size);
				this.#icon_image.setScale(scale);
			}
		#createBackground(){
			const background_radius = 0.9 * this.#size / 2;
			const background_color = this.#getBackgroundColor();
			this.#background = this.#scene.add.graphics({ fillStyle: { color: background_color } });
			const circle = new Phaser.Geom.Circle(0, 0, background_radius);
			this.#background.fillCircleShape(circle);
		}
			#getBackgroundColor(){
				if (this.#player_index_symbol === player_index.PLAYER1){
					return (gameConfig.scene_play.player.color.left);
				} else {
					return (gameConfig.scene_play.player.color.right);
				}
			}
	
	#resizeContainer(){
		this.width = this.#size;
		this.height = this.#size;
	}

	#addComponentsToContainer(){
		this.add(this.#components_array);
	}

	#positionComponents(){
		this.depth = gameConfig.scene_menu.depths.player_panels;
	}
	
	#rotate_icon(){
		let angle = gameConfig.scene_menu.player_panel.icon_angle;
		if (this.#player_index_symbol === player_index.PLAYER2){
			angle *= -1;
		}
		this.setAngle(angle);
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