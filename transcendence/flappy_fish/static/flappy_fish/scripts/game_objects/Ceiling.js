class Ceiling {

	#scene;
	#loaded_texture_name;
	object;

	constructor(scene, loaded_texture_name){
		this.#scene = scene;
		this.#loaded_texture_name = loaded_texture_name;
		this.#createObject();
		this.#resizeObject();
		this.#addPhysics();
	}

	#createObject(){
		const coordinates_x = 0;
		const coordinates_y = 0;
		const width = gameConfig.width;
		const height = gameTextures.ceiling.height;
		this.object = this.#scene.add.tileSprite(coordinates_x, coordinates_y, width, height, this.#loaded_texture_name);
		this.object.setOrigin(0, 0);
		this.object.depth = gameConfig.depth.ceiling;
	}

	#resizeObject(){
		this.object.setScale(1, gameConfig.ceiling.height / gameTextures.ceiling.height);
	}

	#addPhysics(){
		this.#scene.physics.world.enable(this.object);
		this.object.body.setImmovable(true);
	}

	update(velocity, delay){
		this.object.tilePositionX += velocity * delay / 1000 * gameConfig.ceiling.speed_factor;
	}

}