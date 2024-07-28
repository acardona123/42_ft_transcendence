class Beam extends Phaser.GameObjects.Sprite{
	constructor(scene){
		var x = scene.player.x;
		var y = scene.player.y - scene.player.height / 2 - 10;

		super(scene, x, y, "beam");
		this.play("beam_anim");

		scene.add.existing(this);
		scene.physics.world.enableBody(this);
		this.body.velocity.y = gameSettings.beam_velocity_y;

		scene.projectiles.add(this);
	}

	update(){
		if (this.y < 32)
		{
			this.destroy();
		}
	}
}