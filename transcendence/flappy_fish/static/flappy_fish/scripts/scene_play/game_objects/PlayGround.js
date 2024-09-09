class PlayGround extends AbstractVerticallyScaledTileSprite{

	constructor(ground_scene_texture){
		const x = 0;
		const y =  gameConfig.height - gameConfig.scenePlay.ground.height;
		const width = gameConfig.width;
		const height = gameConfig.scenePlay.ground.height;
		const depth = gameConfig.scenePlay.depth.ground;

		super (ground_scene_texture, x, y, width, height, depth);
		this.#addPhysics();
	}

	#addPhysics(){
		this.scene_texture.scene.physics.world.enable(this.object);
		this.object.body.setImmovable(true);
	}

	update(velocity, delay){
		const position_step =  velocity * delay / 1000 * gameConfig.scenePlay.ground.speed_factor;
		this.object.tilePositionX += position_step;
	}
}