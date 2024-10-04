const border_side = Object.freeze({
	TOP:   Symbol("top"),
	LEFT:  Symbol("left"),
	BOTTOM:  Symbol("bottom"),
	RIGHT: Symbol("right")
});

class pg_AbstractBorder extends Phaser.GameObjects.Rectangle{
	constructor(scene, orientation){
		switch (orientation){
			case border_side.BOTTOM:
				super(scene, pg_gameConfig.width / 2, pg_gameConfig.height - pg_gameConfig.scene_play.border.thickness / 2, pg_gameConfig.width, pg_gameConfig.scene_play.border.thickness, pg_gameConfig.scene_play.border.color, pg_gameConfig.scene_play.border.alpha);
				break;
			case border_side.LEFT:
				super(scene, pg_gameConfig.scene_play.border.thickness / 2, pg_gameConfig.height / 2, pg_gameConfig.scene_play.border.thickness, pg_gameConfig.height, pg_gameConfig.scene_play.border.color, pg_gameConfig.scene_play.border.alpha);
				break;
			case border_side.RIGHT:
				super(scene, pg_gameConfig.width - pg_gameConfig.scene_play.border.thickness / 2, pg_gameConfig.height / 2, pg_gameConfig.scene_play.border.thickness, pg_gameConfig.height, pg_gameConfig.scene_play.border.color, pg_gameConfig.scene_play.border.alpha);
				break;
			case border_side.TOP:
				super(scene, pg_gameConfig.width / 2, pg_gameConfig.scene_play.border.thickness / 2, pg_gameConfig.width, pg_gameConfig.scene_play.border.thickness, pg_gameConfig.scene_play.border.color, pg_gameConfig.scene_play.border.alpha);
				break;
			default:
				throw new Error("Invalid border orientation");
		}
		if (this.constructor === pg_AbstractBorder){
			throw new Error("Can't instantiate AbstractBorder, it is an abstract class");
		}
		this.orientation = orientation;
	}
}
