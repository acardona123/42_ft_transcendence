class SceneGameFinished extends Phaser.Scene{
	#scores;
	#match_duration_s;
	
	constructor(scores){
		super("GameFinished");
		this.#scores = 0;
	}

	init(data){
		this.#scores = data.scores;
		this.#match_duration_s = data.duration_ms / 1000;
	}
	
	create(){
		this.createBackground();
		this.createRecapTexts();
	}
	
	createBackground(){
		this.background = this.add.sprite(0, 0, "background");
		this.background.setDisplaySize(this.scale.width, this.scale.height);
		this.background.setSize(this.scale.width, this.scale.height);
		this.background.setOrigin(0, 0);
	}
	
	createRecapTexts(){
		const recap_style = {fontFamily: gameConfig.recapText.font, fontSize: gameConfig.recapText.fontSize, fill: gameConfig.recapText.color};
		const recap_position = {x: 0, y: 0};
		const recap = [];
		recap.push(this.#createScoreText(recap_style));
		recap.push(this.#createDurationText(recap_style));
		recap[0].setPosition(recap_position.x, recap_position.y)
		Phaser.Actions.AlignTo(recap, Phaser.Display.Align.BOTTOM_LEFT);
	}
	#createScoreText(recap_style){
		return(this.add.text(0, 0, "Score: " + this.#scores.left.getScore() + " - " + this.#scores.right.getScore(), recap_style));
	}
	#createDurationText(recap_style){
		return (this.add.text(0, 0, "Duration: " + Math.round(this.#match_duration_s * 100) / 100 + "s", recap_style));
	}

}