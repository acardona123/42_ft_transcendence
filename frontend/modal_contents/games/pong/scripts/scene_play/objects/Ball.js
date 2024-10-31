
class pg_Ball extends Phaser.GameObjects.Ellipse {
	radius;

	constructor(scene, x, y, radius, velocityX = 0, velocityY = 0, color = 0xFFFFFF, alpha = 1) {
		super(scene, x, y, radius * 2, radius * 2,color, alpha);
		this.depth = pg_gameConfig.scene_play.depths.balls;
		this.radius = radius;
		scene.add.existing(this);
		scene.addToBallsGroup(this);
		
		scene.physics.add.existing(this)
		this.body.setVelocityX(velocityX);
		this.body.setVelocityY(velocityY);
		this.body.setCollideWorldBounds(true);
		this.body.setBounce(1);
	}
}
