class PlayBackground extends AbstractVerticallyScaledTileSprite {

	constructor(background_scene_texture){
		const x = 0;
		const y = gameConfig.scenePlay.textboard.height + gameConfig.scenePlay.ceiling.height;
		const width = gameConfig.width;
		const height = gameConfig.height - gameConfig.scenePlay.textboard.height + gameConfig.scenePlay.ceiling.height - gameConfig.scenePlay.ground.height;
		const depth = gameConfig.scenePlay.depth.background;

		super (background_scene_texture, x, y, width, height, depth);
	}
}