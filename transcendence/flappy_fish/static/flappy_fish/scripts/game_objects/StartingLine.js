class StartingLine {

	scene_texture;
	object;

	constructor(starting_line_scene_texture){
		this.scene_texture = starting_line_scene_texture;
		this.#createObject();
		this.#addPhysics();
	}

	#createObject(){
		const top_y = gameConfig.textboard.height + gameConfig.ceiling.height;
		const bottom_y = gameConfig.height - gameConfig.ground.height;
		const x = gameConfig.width * 0.7 ;
		const y = top_y;
		const width = Math.min (gameConfig.starting_line.width, 0.1 * gameConfig.width);
		const height = bottom_y - top_y;
		this.object = this.scene_texture.createTileSprite(x, y, width, height);
		this.object.setOrigin(0, 0);
		this.object.depth = gameConfig.depth.starting_line;
		this.object.alpha = gameConfig.starting_line.alpha;
	}

	#addPhysics(){
		this.scene_texture.scene.physics.world.enable(this.object);
		this.object.body.setImmovable(true);
		this.object.body.setVelocity(-gameConfig.velocity_x.init_value, 0);
	}


}