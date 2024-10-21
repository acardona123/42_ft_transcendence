class fb_PlayerExplosion {
	object;

	constructor(explosion_scene_texture, x, y){
		this.object = explosion_scene_texture.createOnScene(x, y);
		this.#rescaleExplosion();
		explosion_scene_texture.playAnimationOn(this.object);
	}
		#rescaleExplosion(){
			const scale_width = fb_gameconfig.scene_play.player.width/ this.object.width;
			const scale_height = fb_gameconfig.scene_play.player.height / this.object.height;
			this.object.setScale(scale_width,scale_height);
		}
}