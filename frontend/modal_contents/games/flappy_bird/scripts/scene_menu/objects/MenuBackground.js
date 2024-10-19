class fb_MenuBackground extends AbstractVerticallyScaledTileSprite {

	constructor(background_scene_texture){
		const x = 0;
		const y = fb_gameConfig.scene_menu.ceiling.height;
		const width = fb_gameConfig.width;
		const height = fb_gameConfig.height - fb_gameConfig.scene_menu.ceiling.height - fb_gameConfig.scene_menu.ground.height;
		const depth = fb_gameConfig.scene_menu.depth.background;

		super (background_scene_texture, x, y, width, height, depth);
	}
}