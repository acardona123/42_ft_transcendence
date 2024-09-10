class AbstractClock extends TimeDisplay {

	scene;
	#is_paused;

	constructor(scene, x, y, style, time_s = 0){
		super(scene, x, y, style, time_s);
		this.scene = scene;
		this.#is_paused = true;
		this.depth = gameConfig.scene_play.depths.clock;
	}

	pause(){
		throw new Error ("Can't use AbstractClock.pause, it is an abstract class")
	}

	resume(){
		throw new Error ("Can't call AbstractClock.resume, it is an abstract class")
	}

	start(){
		throw new Error ("Can't use AbstractClock.start, it is an abstract class")
	}

	isPaused(){
		return (this.#is_paused);
	}

	setPause(pauseStatus){
		this.#is_paused = pauseStatus;
	}

	getPastTime(){
		throw new Error ("Can't use AbstractClock.getPastTime, it is an abstract class")
	}
}