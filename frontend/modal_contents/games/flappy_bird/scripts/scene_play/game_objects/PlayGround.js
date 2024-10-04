class fb_PlayGround extends AbstractVerticallyScaledTileSprite{

	constructor(ground_scene_texture){
		const x = 0;
		const y =  fb_gameConfig.height - fb_gameConfig.scenePlay.ground.height;
		const width = fb_gameConfig.width;
		const height = fb_gameConfig.scenePlay.ground.height;
		const depth = fb_gameConfig.scenePlay.depth.ground;

		super (ground_scene_texture, x, y, width, height, depth);
		this.#addPhysics();
	}

	#addPhysics(){
		this.scene_texture.scene.physics.world.enable(this.object);
		this.object.body.setImmovable(true);
	}

	update(velocity, delay){
		const position_step =  velocity * delay / 1000 * fb_gameConfig.scenePlay.ground.speed_factor;
		this.object.tilePositionX += position_step;
	}
}