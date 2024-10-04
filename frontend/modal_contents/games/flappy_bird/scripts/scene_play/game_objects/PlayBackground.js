class fb_PlayBackground extends AbstractVerticallyScaledTileSprite {

	constructor(background_scene_texture){
		const x = 0;
		const y = fb_gameConfig.scenePlay.textboard.height + fb_gameConfig.scenePlay.ceiling.height;
		const width = fb_gameConfig.width;
		const height = fb_gameConfig.height - fb_gameConfig.scenePlay.textboard.height - fb_gameConfig.scenePlay.ceiling.height - fb_gameConfig.scenePlay.ground.height;
		const depth = fb_gameConfig.scenePlay.depth.background;

		super (background_scene_texture, x, y, width, height, depth);
	}
}