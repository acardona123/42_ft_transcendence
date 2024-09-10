class DeathBorder extends AbstractBorder{
	constructor(scene, orientation){
		super(scene, orientation);
		scene.addToDeathBordersGroup(this);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.depth = gameConfig.scene_play.depths.death_border;
		this.body.immovable = true;
		this.body.setBounce(1);
	}
}