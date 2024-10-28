class fb_GameFinishedCeiling extends AbstractVerticallyScaledTileSprite {

	constructor(ceiling_scene_texture){
		const x = 0;
		const y = 0;
		const width = fb_gameConfig.width;
		const height = fb_gameConfig.scene_game_finished.ceiling.height;
		const depth = fb_gameConfig.scene_game_finished.depth.ceiling;

		super (ceiling_scene_texture, x, y, width, height, depth);
	}
}