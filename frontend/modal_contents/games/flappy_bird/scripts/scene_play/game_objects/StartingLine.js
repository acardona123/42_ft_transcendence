class fb_StartingLine {

	scene_texture;
	object;

	constructor(starting_line_scene_texture){
		this.scene_texture = starting_line_scene_texture;
		this.#createObject();
		this.#addPhysics();
	}

	#createObject(){
		const top_y = fb_gameconfig.scene_play.textboard.height + fb_gameconfig.scene_play.ceiling.height;
		const bottom_y = fb_gameConfig.height - fb_gameconfig.scene_play.ground.height;
		const x = fb_gameConfig.width * 0.7 ;
		const y = top_y;
		const width = Math.min (fb_gameconfig.scene_play.starting_line.width, 0.1 * fb_gameConfig.width);
		const height = bottom_y - top_y;
		this.object = this.scene_texture.createTileSprite(x, y, width, height);
		this.object.setOrigin(0, 0);
		this.object.depth = fb_gameconfig.scene_play.depth.starting_line;
		this.object.alpha = fb_gameconfig.scene_play.starting_line.alpha;
	}

	#addPhysics(){
		this.scene_texture.scene.physics.world.enable(this.object);
		this.object.body.setImmovable(true);
		this.object.body.setVelocity(-fb_gameconfig.scene_play.velocity_x.init_value, 0);
	}
}