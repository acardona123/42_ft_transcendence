class fb_PlayGround extends AbstractVerticallyScaledTileSprite{

	constructor(ground_scene_texture){
		const x = 0;
		const y =  fb_gameConfig.height - fb_gameconfig.scene_play.ground.height;
		const width = fb_gameConfig.width;
		const height = fb_gameconfig.scene_play.ground.height;
		const depth = fb_gameconfig.scene_play.depth.ground;

		super (ground_scene_texture, x, y, width, height, depth);
		this.#addPhysics();
	}

	#addPhysics(){
		this.scene_texture.scene.physics.world.enable(this.object);
		this.object.body.setImmovable(true);
	}

	update(velocity, delay){
		this.object.tilePositionX += velocity * delay / 1000 * fb_gameconfig.scene_play.ground.speed_factor;
	}
}