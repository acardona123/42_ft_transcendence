
class fb_Score extends Phaser.GameObjects.Container{
	#scene;
	#player_index_symbol;
	#icon_scene_texture;
	#icon_size;
	#icon_padding;
	#texture_flipped;

	#icon;
	#text;

	#death_count;

	constructor(scene, player_index_symbol, icon_scene_texture, flip_texture = false, width = fb_gameConfig.width / 3, height = fb_gameConfig.scene_play.textboard.height, icon_size = fb_gameConfig.scene_play.textboard.icon_size, icon_padding = fb_gameConfig.scene_play.textboard.icon_padding){
		super(scene);
		this.height = height;
		this.width = width;
		this.depth = fb_gameConfig.scene_play.depth.textboard.text;

		this.#scene = scene;
		this.#player_index_symbol = player_index_symbol;
		this.#icon_scene_texture = icon_scene_texture;
		this.#icon_size = icon_size;
		this.#icon_padding = icon_padding;
		this.#texture_flipped = flip_texture;
		this.#death_count = 0;

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
			this.#icon.flipX = this.#texture_flipped;
		}
		#addText(){
			this.#text = new fb_ScoreText(this.#scene, this.#player_index_symbol, 0, 0, this.width - this.#icon_size - this.#icon_padding);
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
				this.#text.setPosition(this.#icon_size + this.#icon_padding - this.width / 2, 0);
			} else {
				this.#text.setPosition(this.width / 2 -this.#icon_size - this.#icon_padding, 0);
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
		this.#death_count += 1;
		if (areLivesLimited()){
			this.#text.losePoints(1)
		} else {
			this.#text.addPoints(1);
		}
	}

	getScoreValue(){
		return (this.#text.getScore());
	}

	getDeathCount(){
		return (this.#death_count);
	}
}