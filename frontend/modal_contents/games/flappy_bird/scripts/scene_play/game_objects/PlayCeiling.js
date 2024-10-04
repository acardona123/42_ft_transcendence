class fb_PlayCeiling extends AbstractVerticallyScaledTileSprite {

	constructor(ceiling_scene_texture){
		const x = 0;
		const y = fb_gameConfig.scenePlay.textboard.height;
		const width = fb_gameConfig.width;
		const height = fb_gameConfig.scenePlay.ceiling.height;
		const depth = fb_gameConfig.scenePlay.depth.ceiling;

		super (ceiling_scene_texture, x, y, width, height, depth);
		this.#addPhysics();
	}

	#addPhysics(){
		this.scene_texture.scene.physics.world.enable(this.object);
		this.object.body.setImmovable(true);
	}

	update(velocity, delay){
		this.object.tilePositionX += velocity * delay / 1000 * fb_gameConfig.scenePlay.ceiling.speed_factor;
	}

}