class ScoreText extends AlignedText{
	#player_index;
	#value;

	constructor(scene, player_index, x = 0, y = 0){
		if (player_index != player_index.PLAYER1 && player_index != player_index.PLAYER2){
			throw new Error("Wrong player side for the scores")
		}
		const score_text = '0';
		const score_style = {fontFamily: gameConfig.score.font, fontSize: gameConfig.score.fontSize, fill: gameConfig.score.color};
		const score_alignment = this.#getTextAlignmentFromPlayerIndex(player_index);
		super(scene, score_alignment, x, y, score_text, score_style);
		this.#value = 0;
		scene.add.existing(this);
	}
		#getTextAlignmentFromPlayerIndex(player_index){
			if (player_index === player_index.PLAYER1){
				return (text_alignment.ALIGN_LEFT);
			} else{
				return (text_alignment.ALIGN_RIGHT);
			}
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
		if (this.#player_index === player_index.PLAYER1){
			this.setText("x " + this.#value);
		} else {
			this.setText(this.#value + " x");
		}
	}

	greaterThan(number){
		return (this.#value >= number)
	}

	lessThan(number){
		return (this.#value <= number)
	}
}