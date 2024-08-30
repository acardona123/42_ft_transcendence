class Background {

	scene_texture;
	object;

	constructor(background_scene_texture){
		this.scene_texture = background_scene_texture;
		this.#createObject();
	}

	#createObject(){
		const x = 0;
		const y = gameConfig.ceiling.height;
		const width = gameConfig.width;
		const height = this.scene_texture.texture.height;
		this.object = this.scene_texture.createTileSpriteScaledVertically(x, y, width, height);
		this.object.setOrigin(0, 0);
		this.object.depth = gameConfig.depth.background;
	}
}