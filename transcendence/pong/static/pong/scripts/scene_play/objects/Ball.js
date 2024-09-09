
class Ball extends Phaser.GameObjects.Ellipse {
    constructor(scene, x, y, radius, velocityX = 0, velocityY = 0, color = 0xFFFFFF, alpha = 1) {
        super(scene, x, y, radius * 2, radius * 2,color, alpha);
        
		scene.add.existing(this);
		scene.balls.add(this);
		
        scene.physics.add.existing(this)
		this.body.setVelocityX(velocityX);
		this.body.setVelocityY(velocityY);
		this.body.setCollideWorldBounds(true);
		this.body.setBounce(1);
    }
}

// === Trying to make a ball with a texture rather than a color:

// class Ball extends Phaser.Physics.Arcade.Image{
	
// 	constructor(scene, x = 0, y = 0, radius = 50, velocityX = 0, velocityY = 0){
// 		super(scene, x, y, "ball");
// 		this.scale = (radius * 2) / Math.min(gameTextures.ball.width, gameTextures.ball.height);
// 		this.setOrigin(0.5);
// 		this.x = x;
//         this.y = y;

// 		let circle_thickness = 0.000001;
// 		let circle_color = 0xff0000;
// 		let circle_background_color = 0xff0000;
// 		let circle_scale = 1;
// 		let circle_feather = 0.05;
// 		this.effect_circle = this.preFX.addCircle(circle_thickness, circle_color, circle_background_color, circle_scale, circle_feather);
// 		this.effect_circle.backgroundAlpha = 1;
// 		// this.preFX.remove(effect)
		
// 		scene.add.existing(this);
// 		scene.balls.add(this);
		
// 		scene.physics.world.enableBody(this);
// 		this.body.setCircle(radius);
// 		this.body.velocity.x = velocityX;
		// this.body.velocity.y = velocityY;
		// this.setCollideWorldBounds(true);
		// this.setBounce(1);
		
// 	};
// }