
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
			this.#text = new ScoreText(this.#scene, this.#player_index_symbol, 0, 0, this.width - this.#icon_size);
		}

	#resizeComponents(){
		this.#resizeIcon();
	}
		#resizeIcon(){
			const icon_scale = this.#calculateIconScale();
			this.#icon.setScale(icon_scale);
		}
			#calculateIconScale(){
				const icon_width = this.#icon_scene_texture.texture.width;
				const icon_height = this.#icon_scene_texture.texture.height
				const target_size = this.#icon_size;
				const size_of_critical_dimension = Math.max(icon_width, icon_height);
				return(target_size / size_of_critical_dimension)
			}
	
	#addComponentsToContainer(){
		this.add([this.#icon, this.#text]);
	}

	#positionComponents(){
		this.#setComponentsOrigins();
		this.#alignComponents();
	}
		#setComponentsOrigins(){
			if (this.#player_index_symbol === player_index.PLAYER1){
				this.#icon.setOrigin(0, 0.5);
				this.#text.setOrigin(0, 0.5);
			} else {
				this.#icon.setOrigin(1, 0.5);
				this.#text.setOrigin(1, 0.5);
			}
		}
		#alignComponents(){
			if (this.#player_index_symbol === player_index.PLAYER1){
				this.#icon.setPosition(-this.width / 2, 0);
				this.#text.setPosition(this.#icon_size - this.width / 2, 0);
			} else {
				this.#text.setPosition(this.width / 2 -this.#icon_size, 0);
				this.#icon.setPosition(this.width / 2, 0)
			}
		}

	setPositionCenterLeft(x, y){
		this.setPosition(x + this.width/2, y);
	}
	setPositionCenterRight(x, y){
		this.setPosition(x - this.width/2, y);
	}

	updatePlayerDied(){
		if (areLivesLimited()){
			this.#text.losePoints(1)
		} else {
			this.#text.addPoints(1);
		}
	}

	getScoreValue(){
		return (this.#text.getScore());
	}


}