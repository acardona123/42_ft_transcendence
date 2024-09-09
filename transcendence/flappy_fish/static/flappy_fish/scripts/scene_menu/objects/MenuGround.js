class MenuGround extends AbstractVerticallyScaledTileSprite{

	constructor(ground_scene_texture){
		const x = 0;
		const y =  gameConfig.height - gameConfig.scene_menu.ground.height;
		const width = gameConfig.width;
		const height = gameConfig.scene_menu.ground.height;
		const depth = gameConfig.scene_menu.depth.ground;

		super (ground_scene_texture, x, y, width, height, depth)
	}
}