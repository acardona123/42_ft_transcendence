class fb_GameFinishedGround extends AbstractVerticallyScaledTileSprite{

	constructor(ground_scene_texture){
		const x = 0;
		const y =  fb_gameConfig.height - fb_gameConfig.scene_game_finished.ground.height;
		const width = fb_gameConfig.width;
		const height = fb_gameConfig.scene_game_finished.ground.height;
		const depth = fb_gameConfig.scene_game_finished.depth.ground;

		super (ground_scene_texture, x, y, width, height, depth)
	}
}