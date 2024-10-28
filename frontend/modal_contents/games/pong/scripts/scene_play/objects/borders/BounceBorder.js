class pg_BounceBorder extends pg_AbstractBorder{
	constructor(scene, orientation){
		super(scene, orientation);
		scene.addToBounceBordersGroup(this);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.depth = pg_gameConfig.scene_play.depths.bounce_border;
		this.body.immovable = true;
		this.body.setBounce(1);
	}
}