class Chronometer extends AbstractClock{

	start_time_s;

	constructor(scene, x, y, style)
	{
		super (scene, x, y, style);
		this.start_time_s = scene.time.now;
	}

	update (){
		const ellapsed_seconds = (scene.time.now - this.start_time_s) / 1000;
		super.update(ellapsed_seconds);
	}
}