const playerSide = Object.freeze({
   LEFT:   Symbol("left"),
   RIGHT:  Symbol("right"),
});

class Score extends AlignedText{
	#value = 0

	constructor(scene, player_side){
		if (player_side != playerSide.LEFT && player_side != playerSide.RIGHT){
			throw new Error("Wrong player side for the scores")
		}
		const score_y = gameConfig.height / 2;
		const score_text = '0';
		const score_style = {fontFamily: gameConfig.scene_play.score.font, fontSize: gameConfig.scene_play.score.fontSize, fill: gameConfig.scene_play.score.color};
		if (player_side === playerSide.LEFT){
			const score_alignment = text_alignment.ALIGN_RIGHT;
			const score_x = gameConfig.width / 2 - gameConfig.scene_play.score.eccentricity;
			super(scene, score_alignment, score_x, score_y, score_text, score_style);
		} else{
			const score_alignment = text_alignment.ALIGN_LEFT;
			const score_x = gameConfig.width / 2 + gameConfig.scene_play.score.eccentricity;
			super(scene, score_alignment, score_x, score_y, score_text, score_style);
		}
		this.depth = gameConfig.scene_play.depths.score;
		this.#value = 0;
		scene.add.existing(this);
	}

	getScore(){
		return (this.#value);
	}

	addPoints(number_of_points){
		this.#value += number_of_points;
		this.updateDisplay();
	}

	losePoints(number_of_points){
		this.#value -= number_of_points;
		if (this.#value < 0){
			this.#value = 0;
		}
		this.updateDisplay();
	}

	updateDisplay(){
		this.setText(this.#value)
	}

	greaterThan(number){
		return (this.#value >= number)
	}
}