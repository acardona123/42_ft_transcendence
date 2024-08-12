class Timer extends AbstractClock{

	#end_time;
	#remaining_time;

	constructor(scene, x, y, duration_sec)
	{
		super (scene, x, y, duration_sec);
		this.#end_time = scene.time.now + duration_sec * 1000;
		this.#remaining_time = duration_sec * 1000;
	}

	update (){
		if (!this.isPaused()){
			this.#updateRemainingTime();
			this.updateDisplay(this.getRemainingTime() / 1000);
		}
	}

	pause(){
		if (! this.isPaused()){
			this.#updateRemainingTime();
			this.setPause(true);
		}
	}

	resume(){
		if (this.isPaused()){
			this.#end_time = this.scene.time.now + this.#remaining_time;
			this.setPause(false);
		}
	}

	#updateRemainingTime(){
		this.#remaining_time = Math.max(0, this.#end_time - this.scene.time.now);
	}

	getRemainingTime(){
		return (this.#remaining_time)
	}

	isTimeOver(){
		return (this.#remaining_time <= 0);
	}

}