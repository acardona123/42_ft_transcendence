class pg_Confetti {

	object;
	scene_texture;

	constructor (confetti_scene_texture, x, y){
		this.scene_texture = confetti_scene_texture
		this.#createObject(x, y);
		this.#playObjectAnimation();
	}

	#createObject(x, y){
		this.object = this.scene_texture.createOnScene(x, y);
		this.object.depth = pg_gameConfig.scene_game_finished.depths.confetti;
		this.#rescaleObject();
	}
		#rescaleObject(){
			const scale = this.scene_texture.getScaleToFit(pg_gameConfig.width / 2, pg_gameConfig.height)
			this.object.setScale(scale);			
		}
	
	#playObjectAnimation(){
		this.scene_texture.playAnimationOn(this.object );
	}
}