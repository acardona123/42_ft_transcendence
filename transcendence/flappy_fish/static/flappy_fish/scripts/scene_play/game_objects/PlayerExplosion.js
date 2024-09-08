class PlayerExplosion {
	object;

	constructor(explosion_scene_texture, x, y){
		this.object = explosion_scene_texture.createOnScene(x, y);
		this.#rescaleExplosion();
		explosion_scene_texture.playAnimationOn(this.object);
	}
		#rescaleExplosion(){
			const scale_width = gameConfig.scenePlay.player.width/ this.object.width;
			const scale_height = gameConfig.scenePlay.player.height / this.object.height;
			this.object.setScale(scale_width,scale_height);
		}
}