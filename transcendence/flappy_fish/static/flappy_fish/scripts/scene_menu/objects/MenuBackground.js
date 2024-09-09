class MenuBackground extends AbstractVerticallyScaledTileSprite {

	constructor(background_scene_texture){
		const x = 0;
		const y = gameConfig.scene_menu.ceiling.height;
		const width = gameConfig.width;
		const height = gameConfig.height + gameConfig.scene_menu.ceiling.height - gameConfig.scene_menu.ground.height;
		const depth = gameConfig.scene_menu.depth.background;

		super (background_scene_texture, x, y, width, height, depth);
	}
}