class Ball extends Phaser.GameObjects.Image{
	
	constructor(scene, x = 0, y = 0, radius = 50, velocityX = 0, velocityY = 0){
		super(scene, x, y, "ball");
		this.scale = (radius * 2) / Math.min(gameTextures.ball.width, gameTextures.ball.height);

		let circle_thickness = 0.000001;
		let circle_color = 0xffffff;
		let circle_background_color = 0xffffff;
		let circle_scale = 1;
		let circle_feather = 0.05;
		this.effect_circle = this.preFX.addCircle(circle_thickness, circle_color, circle_background_color, circle_scale, circle_feather);
		this.effect_circle.backgroundAlpha = 1;
		// this.preFX.remove(effect)
		
		scene.add.existing(this);
		scene.balls.add(this);
		
		scene.physics.world.enableBody(this);
		this.body.setCircle(radius);
		this.body.velocity.x = velocityX;
		this.body.velocity.y = velocityY;
	};
}
