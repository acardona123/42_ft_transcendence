class Chronometer extends AbstractClock{

	#start_time;
	#time_past;

	constructor(scene, x, y)
	{
		super (scene, x, y);
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
			this.updateDisplay(this.getTimePast() / 1000);
		}
	}

	#updateTimePast(){
		this.#time_past = this.scene.time.now - this.#start_time;
	}

	getTimePast(){
		return (this.#time_past);
	}
}