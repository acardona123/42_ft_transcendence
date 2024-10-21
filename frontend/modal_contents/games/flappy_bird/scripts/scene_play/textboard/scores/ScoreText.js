class fb_ScoreText extends fb_AlignedText{
	#player_index_symbol;
	#value;

	constructor(scene, player_index_symbol, x = 0, y = 0, width = -1){
		if (player_index_symbol != player_index.PLAYER1 && player_index_symbol != player_index.PLAYER2){
			throw new Error("Wrong player side for the scores")
		}
		
		const score_text = '0';
		const score_style = fb_gameconfig.scene_play.textboard.text_style;
		const score_alignment = (player_index === player_index.PLAYER1) ? text_alignment.ALIGN_LEFT : text_alignment.ALIGN_RIGHT;
		super(scene, score_alignment, x, y, score_text, score_style);
		scene.add.existing(this);
		
		this.#player_index_symbol = player_index_symbol;
		if (areLivesLimited()){
			this.#value = fb_gameMode.maxDeath;
		} else {
			this.#value = 0;
		}

		this.#limitWidth(width);
		this.updateDisplay();
	}
	#limitWidth(width){
		if (width > 0){
			this.setSize(width, this.height);
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
		let displayed_value = this.#generateDisplayedValue();
		if (this.#player_index_symbol === player_index.PLAYER1){
			this.setText("×" + displayed_value);
		} else {
			this.setText(displayed_value + "×");
		}
	}
		#generateDisplayedValue(){
			if (this.#value > 99){
				return ("99˖")
			} else {
				return (this.#value);
			}
		}

	greaterThan(number){
		return (this.#value >= number)
	}

	lessThan(number){
		return (this.#value <= number)
	}
}