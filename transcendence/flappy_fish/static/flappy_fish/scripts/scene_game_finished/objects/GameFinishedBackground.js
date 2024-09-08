class GameFinishedBackground extends AbstractVerticallyScaledTileSprite {

	constructor(background_scene_texture){
		const x = 0;
		const y = gameConfig.scene_game_finished.ceiling.height;
		const width = gameConfig.width;
		const height = gameConfig.height + gameConfig.scene_game_finished.ceiling.height - gameConfig.scene_game_finished.ground.height;
		const depth = gameConfig.scene_game_finished.depth.background;

		super (background_scene_texture, x, y, width, height, depth);
	}
}