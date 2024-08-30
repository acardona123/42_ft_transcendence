class AbstractClock extends Phaser.GameObjects.Text {

	scene;
	#is_paused;

	constructor(scene, x, y, time_s = 0){
		const clock_style = {fontFamily: gameConfig.clock.font, fontSize: gameConfig.clock.fontSize, fill: gameConfig.clock.color};
		super(scene, x, y, "", clock_style);
		this.scene = scene;
		this.#is_paused = true;
		this.updateDisplay(time_s);
		scene.add.existing(this);
	}

	updateDisplay(time_s){
		let updated_clock_text;
		if (time_s <= 0){
			updated_clock_text = this.#formatClockText(0, 0);
		} else {
			const min = Math.floor(time_s / 60)
			const sec =  Math.ceil(time_s % 60);
			updated_clock_text = this.#formatClockText(sec, min);
		}
		this.setText(updated_clock_text);
	}
	#formatClockText(sec, min){
		return (this.#ZeroPad(min) + ":" + this.#ZeroPad(sec))
	}
	#ZeroPad(number){
		return ((number >= 0 && number < 10) ? "0" : "") + number;
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