class fb_PlayBackground extends AbstractVerticallyScaledTileSprite {

	constructor(background_scene_texture){
		const x = 0;
		const y = fb_gameconfig.scene_play.textboard.height + fb_gameconfig.scene_play.ceiling.height;
		const width = fb_gameConfig.width;
		const height = fb_gameConfig.height - fb_gameconfig.scene_play.textboard.height - fb_gameconfig.scene_play.ceiling.height - fb_gameconfig.scene_play.ground.height;
		const depth = fb_gameconfig.scene_play.depth.background;

		super (background_scene_texture, x, y, width, height, depth);
	}
}