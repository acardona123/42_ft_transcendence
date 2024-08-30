class Ceiling {

	scene_texture;
	object;

	constructor(ceiling_scene_texture){
		this.scene_texture = ceiling_scene_texture;
		this.#createObject();
		this.#addPhysics();
	}

	#createObject(){
		const x = 0;
		const y = 0;
		const width = gameConfig.width;
		const height = gameConfig.ceiling.height;
		this.object = this.scene_texture.createTileSpriteScaledVertically(x, y, width, height);
		this.object.setOrigin(0, 0);
		this.object.depth = gameConfig.depth.ceiling;
	}

	#addPhysics(){
		this.scene_texture.scene.physics.world.enable(this.object);
		this.object.body.setImmovable(true);
	}

	update(velocity, delay){
		this.object.tilePositionX += velocity * delay / 1000 * gameConfig.ceiling.speed_factor;
	}

}