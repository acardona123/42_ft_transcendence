class Background {

	#scene;
	#loaded_texture_name;
	object;

	constructor(scene, loaded_texture_name){
		this.#scene = scene;
		this.#loaded_texture_name = loaded_texture_name;
		this.#createObject();
		this.#resizeObject();
	}

	#createObject(){
		const coordinates_x = 0;
		const coordinates_y = gameConfig.ceiling.height;
		const width = gameConfig.width;
		const height = gameTextures.background.height;
		this.object = this.#scene.add.tileSprite(coordinates_x, coordinates_y, width, height, this.#loaded_texture_name);
		this.object.setOrigin(0, 0);
		this.object.depth = gameConfig.depth.background;
	}

	#resizeObject(){
		const background_display_height = gameConfig.height - gameConfig.ground.height - gameConfig.ceiling.height;
		this.object.setScale(1, background_display_height / gameTextures.background.height);
	}
}