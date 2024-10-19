class fb_GameFinishedBackground extends AbstractVerticallyScaledTileSprite {

	constructor(background_scene_texture){
		const x = 0;
		const y = fb_gameConfig.scene_game_finished.ceiling.height;
		const width = fb_gameConfig.width;
		const height = fb_gameConfig.height - fb_gameConfig.scene_game_finished.ceiling.height - fb_gameConfig.scene_game_finished.ground.height;
		const depth = fb_gameConfig.scene_game_finished.depth.background;

		super (background_scene_texture, x, y, width, height, depth);
	}
}