class fb_Chronometer extends fb_AbstractClock{

	#start_time;
	#time_past;

	constructor(scene, x, y, style)
	{
		super (scene, x, y, style);
		this.#start_time = scene.time.now;
		this.#time_past = 0;
		this.updateDisplay(0);
	}

	start(){
		this.#start_time = this.scene.time.now;
		this.setPause(false);
	}

	pause(){
		if (! this.isPaused()){
			this.#updateTimePast();
			this.setPause(true);
		}
	}

	resume(){
		if (this.isPaused()){
			this.#start_time = this.scene.time.now - this.#time_past;
			this.setPause(false);
		}
	}

	update (){
		if (!this.isPaused()){
			this.#updateTimePast();
			this.updateDisplay(this.getPastTime() / 1000);
		}
	}

	#updateTimePast(){
		this.#time_past = this.scene.time.now - this.#start_time;
	}

	getPastTime(){
		return (this.#time_past);
	}
}