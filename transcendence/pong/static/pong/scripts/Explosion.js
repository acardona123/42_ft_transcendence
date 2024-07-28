class Explosion extends Phaser.GameObjects.Sprite{
	constructor (scene, x, y, scale = 1){
		super(scene, x, y, "explosion");
		scene.add.existing(this);
		this.setScale(scale);
		this.play("explode_anim");
	}
}