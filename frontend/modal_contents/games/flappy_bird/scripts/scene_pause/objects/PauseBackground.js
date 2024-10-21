class fb_PauseBackground {
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
			const scale_x = this.#scene_texture.getScaleToTargetWidth(fb_gameConfig.width);
			const scale_y = this.#scene_texture.getScaleToTargetHeight(fb_gameConfig.height);
			this.object.setScale(scale_x, scale_y);
		}
		#positionObject(){
			this.object.setOrigin(0);
			this.object.depth = fb_gameConfig.scene_pause.depths.background;
		}
		#applyObjectAnimation(){
			this.#scene_texture.playAnimationOn(this.object);
		}
}