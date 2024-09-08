class PlayCeiling extends AbstractVerticallyScaledTileSprite {

	constructor(ceiling_scene_texture){
		const x = 0;
		const y = gameConfig.scenePlay.textboard.height;
		const width = gameConfig.width;
		const height = gameConfig.scenePlay.ceiling.height;
		const depth = gameConfig.scenePlay.depth.ceiling;

		super (ceiling_scene_texture, x, y, width, height, depth);
		this.#addPhysics();
	}

	#addPhysics(){
		this.scene_texture.scene.physics.world.enable(this.object);
		this.object.body.setImmovable(true);
	}

	update(velocity, delay){
		this.object.tilePositionX += velocity * delay / 1000 * gameConfig.scenePlay.ceiling.speed_factor;
	}

}