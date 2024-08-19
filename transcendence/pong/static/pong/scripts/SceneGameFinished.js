class SceneGameFinished extends Phaser.Scene{
	#scores;
	
	constructor(scores){
		super("GameFinished");
		this.#scores = scores;
	}
	
	create(){
		const score_style = {fontFamily: gameConfig.score.font, fontSize: gameConfig.score.fontSize, fill: gameConfig.score.color};
		this.add.text(100, 100, "test: " + this.#scores, score_style);
	}
}