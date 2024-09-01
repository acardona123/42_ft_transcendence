class SceneGameFinished extends Phaser.Scene{
	
	#score_player1;
	#score_player2;
	#past_time;

	constructor(){
		super("GameFinished");
	}

	init(values){
		this.#score_player1 = values.score_player1;
		this.#score_player2 = values.score_player2;
		this.#past_time = values.past_time;
	}
	
	create(){
		console.log(`score_player1 = ${this.#score_player1}`);
		console.log(`score_player2 = ${this.#score_player2}`);
		console.log(`past_time = ${this.#past_time / 1000}s`);
	}
}