class fb_MenuGround extends AbstractVerticallyScaledTileSprite{

	constructor(ground_scene_texture){
		const x = 0;
		const y =  fb_gameConfig.height - fb_gameConfig.scene_menu.ground.height;
		const width = fb_gameConfig.width;
		const height = fb_gameConfig.scene_menu.ground.height;
		const depth = fb_gameConfig.scene_menu.depth.ground;

		super (ground_scene_texture, x, y, width, height, depth)
	}
}