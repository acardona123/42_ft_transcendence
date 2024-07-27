class Beam extends Phaser.GameObjects.Sprite{
	constructor(scene){
		var x = scene.player.x;
		var y = scene.player.y - scene.player.height / 2 - ;

		super(scene, x, y, "beam");
		scene.add.existing(this);
		scene.projectiles.add(this);
	}
}