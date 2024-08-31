
class Score extends Phaser.GameObjects.Container{
	#scene;
	#player_index_symbol;
	#icon_scene_texture;
	#icon_size;
	#icon;
	#text;

	constructor(scene, player_index_symbol, icon_scene_texture, width = gameConfig.width / 3, height = gameConfig.textboard.height, icon_size = gameConfig.textboard.icon_size){
		super(scene);
		this.height = height;
		this.width = width;
		this.depth = gameConfig.depth.textboard.text;

		this.#scene = scene;
		this.#player_index_symbol = player_index_symbol;
		this.#icon_scene_texture = icon_scene_texture;
		this.#icon_size = icon_size;

		this.#addComponents();
		this.#resizeComponents();
		this.#addComponentsToContainer();
		this.#positionComponents();
		this.#scene.add.existing(this);

		this.#scene.physics.world.enable(this);
		this.#scene.physics.world.enable(this.#icon);
		this.#scene.physics.world.enable(this.#text);
	}

	#addComponents(){
		this.#addIcon();
		this.#addText();
	}
		#addIcon(){
			this.#icon = this.#icon_scene_texture.createOnScene();
			this.#icon_scene_texture.playAnimationOn(this.#icon);
		}
		#addText(){
			this.#text = new ScoreText(this.#scene, this.#player_index_symbol);
		}

	#resizeComponents(){
		this.#resizeIcon();
	}
		#resizeIcon(){
			const icon_scale = this.#calculateIconScale();
			this.#icon.setScale(icon_scale);
			this.#icon.width *= icon_scale;
			this.#icon.height *= icon_scale;
		}
			#calculateIconScale(){
				const icon_width = this.#icon_scene_texture.texture.width;
				const icon_height = this.#icon_scene_texture.texture.height
				const target_size = this.#icon_size;
				const size_of_critical_dimension = Math.max(icon_width, icon_height);
				return(target_size / size_of_critical_dimension)
			}

	#positionComponents(){
		this.#setComponentsOrigins();
		const componentsLeftToRight = this.#getComponentsLeftToRight()
		this.#setFirstElementPosition(componentsLeftToRight[0]);
		this.#alignComponents(componentsLeftToRight);
	}
		#setComponentsOrigins(){
			this.#icon.setOrigin(0);
			this.#text.setOrigin(0);
		}
		#getComponentsLeftToRight(){
			if (this.#player_index_symbol === player_index.PLAYER1){
				return ([this.#icon, this.#text]);
			} else {
				return (this.#text, this.#icon);
			}
		}
		#setFirstElementPosition(first_element){
			first_element.setPosition(-this.width / 2 , -first_element.height / 2);
		}
		#alignComponents(componentsLeftToRight){
			Phaser.Actions.AlignTo(componentsLeftToRight, Phaser.Display.Align.RIGHT_CENTER);
		}
	
	#addComponentsToContainer(){
		// this.add(this.#icon);
		// this.add(this.#text);
		this.add([this.#icon, this.#text]);
	}

	updatePlayerDied(){
		if (areLivesLimited()){
			this.#text.losePoints(1)
		} else {
			this.#text.addPoints(1);
		}
	}
}