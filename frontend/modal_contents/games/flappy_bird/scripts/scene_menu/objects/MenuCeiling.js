class fb_MenuCeiling extends AbstractVerticallyScaledTileSprite {

	constructor(ceiling_scene_texture){
		const x = 0;
		const y = 0;
		const width = fb_gameConfig.width;
		const height = fb_gameConfig.scene_menu.ceiling.height;
		const depth = fb_gameConfig.scene_menu.depth.ceiling;

		super (ceiling_scene_texture, x, y, width, height, depth);
	}
}