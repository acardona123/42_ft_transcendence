class Ground {

	scene_texture;
	object;

	constructor(ground_scene_texture){
		this.scene_texture = ground_scene_texture;
		this.#createObject();
		this.#addPhysics();
	}

	#createObject(){
		const x = 0;
		const y =  gameConfig.height - gameConfig.ground.height;
		const width = gameConfig.width;
		const height = gameConfig.ground.height;
		this.object = this.scene_texture.createTileSpriteScaledVertically(x, y, width, height);
		this.object.setOrigin(0, 0);
		this.object.depth = gameConfig.depth.ground;
	}

	#addPhysics(){
		this.scene_texture.scene.physics.world.enable(this.object);
		this.object.body.setImmovable(true);
	}

	update(velocity, delay){
		this.object.tilePositionX += velocity * delay / 1000 * gameConfig.ground.speed_factor;
	}
}