const border_side = Object.freeze({
    TOP:   Symbol("top"),
    LEFT:  Symbol("left"),
    BOTTOM:  Symbol("bottom"),
    RIGHT: Symbol("right")
});

class AbstractBorder extends Phaser.GameObjects.Rectangle{
	constructor(scene, orientation){
		switch (orientation){
			case border_side.BOTTOM:
				super(scene, gameConfig.width / 2, gameConfig.height - gameConfig.border.thickness / 2, gameConfig.width, gameConfig.border.thickness, gameConfig.border.color, gameConfig.border.alpha);
				break;
			case border_side.LEFT:
				super(scene, gameConfig.border.thickness / 2, gameConfig.height / 2, gameConfig.border.thickness, gameConfig.height, gameConfig.border.color, gameConfig.border.alpha);
				break;
			case border_side.RIGHT:
				super(scene, gameConfig.width - gameConfig.border.thickness / 2, gameConfig.height / 2, gameConfig.border.thickness, gameConfig.height, gameConfig.border.color, gameConfig.border.alpha);
				break;
			case border_side.TOP:
				super(scene, gameConfig.width / 2, gameConfig.border.thickness / 2, gameConfig.width, gameConfig.border.thickness, gameConfig.border.color, gameConfig.border.alpha);
				break;
			default:
				throw new Error("Invalid border orientation");
		}
		if (this.constructor === AbstractBorder){
			throw new Error("Can't instantiate AbstractBorder, it is an abstract class");
		}
		this.orientation = orientation;
	}
}