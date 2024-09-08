class GameFinishedCeiling extends AbstractVerticallyScaledTileSprite {

	constructor(ceiling_scene_texture){
		const x = 0;
		const y = 0;
		const width = gameConfig.width;
		const height = gameConfig.scene_game_finished.ceiling.height;
		const depth = gameConfig.scene_game_finished.depth.ceiling;

		super (ceiling_scene_texture, x, y, width, height, depth);
	}
}