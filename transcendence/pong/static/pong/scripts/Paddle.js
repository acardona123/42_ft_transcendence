class Paddle extends Phaser.GameObjects.Graphics {
	constructor(scene, middleX, middleY, length, width, color = 0xFFFFFF, rotation_angle = 0, alpha = 1){
		super(scene);
		
		this.fillStyle(color, alpha);
		
		const ratio_radius_width = 3 / 4;
		const angle_radius = Math.min(width * ratio_radius_width, length / 2);
		const pad_angles_radiuses = {tl:0, tr:0, bl:angle_radius, br:angle_radius};
		this.fillRoundedRect(middleX - length / 2, middleY, length, width, pad_angles_radiuses);

		// this.setAngle(rotation_angle);
		this.angle = rotation_angle;
		

		scene.add.existing(this);
		scene.physics.world.enableBody(this);
	}
}