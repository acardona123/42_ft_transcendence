class PlayBackground {
	#scene_texture;
	object;

	constructor(background_scene_texture){
		this.#scene_texture = background_scene_texture;

		this.#createObject();
		this.#rescaleObject();
		this.#positionObject();
		this.#applyObjectAnimation();
	}
		#createObject(){
			this.object = this.#scene_texture.createOnScene();
		}
		#rescaleObject(){
			const scale_x = this.#scene_texture.getScaleToTargetWidth(gameConfig.width);
			const scale_y = this.#scene_texture.getScaleToTargetHeight(gameConfig.height);
			this.object.setScale(scale_x, scale_y);
		}
		#positionObject(){
			this.object.setOrigin(0);
			this.object.depth = gameConfig.scene_menu.background;
		}
		#applyObjectAnimation(){
			this.#scene_texture.playAnimationOn(this.object);
		}
}