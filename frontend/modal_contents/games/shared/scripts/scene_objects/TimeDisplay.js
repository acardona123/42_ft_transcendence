class TimeDisplay extends Phaser.GameObjects.Text {

	constructor(scene, x, y, style, time_s = 0){
		super(scene, x, y, "", style);
		this.updateDisplay(time_s);
		scene.add.existing(this);
	}

	updateDisplay(time_s){
		let updated_clock_text;
		if (time_s <= 0){
			updated_clock_text = this.#formatTimeText(0, 0);
		} else {
			time_s = Math.ceil(time_s);
			const min = Math.floor(time_s / 60);
			const sec =  Math.floor(time_s % 60);
			updated_clock_text = this.#formatTimeText(sec, min);
		}
		this.setText(updated_clock_text);
	}
	#formatTimeText(sec, min){
		return (this.#ZeroPad(min) + ":" + this.#ZeroPad(sec))
	}
	#ZeroPad(number){
		return ((number >= 0 && number < 10) ? "0" : "") + number;
	}
}