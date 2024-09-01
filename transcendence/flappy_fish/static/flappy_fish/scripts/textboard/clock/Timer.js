class Timer extends AbstractClock{

	//all times are in ms
	#end_time;
	#remaining_time;
	#targetedDuration;

	constructor(scene, x, y, style, duration_sec)
	{
		super (scene, x, y, style, duration_sec);
		this.#targetedDuration = duration_sec * 1000;
		this.#end_time = scene.time.now + this.#targetedDuration;
		this.#remaining_time = this.#targetedDuration;
		this.updateDisplay(this.#remaining_time / 1000)
	}

	start(){
		this.#end_time = this.scene.time.now + this.#remaining_time;
		this.setPause(false);
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

	update (){
		if (!this.isPaused()){
			this.#updateRemainingTime();
			this.updateDisplay(this.getRemainingTime() / 1000);
		}
	}

	#updateRemainingTime(){
		this.#remaining_time = Math.max(0, this.#end_time - this.scene.time.now);
	}

	getRemainingTime(){
		return (this.#remaining_time)
	}

	getPastTime(){
		return (this.#targetedDuration - this.getRemainingTime());
	}

	isTimeOver(){
		return (this.#remaining_time <= 0);
	}

}