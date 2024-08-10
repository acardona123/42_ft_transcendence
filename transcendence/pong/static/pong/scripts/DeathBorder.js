class DeathBorder extends AbstractBorder{
	constructor(scene, orientation){
		super(scene, orientation);
		scene.death_borders.add(this);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.body.immovable = true;
		this.body.setBounce(1);
	}
}