class Textboard extends Phaser.GameObjects.Container{
	#scene;
	#score_player1;
	#score_player2;
	#clock;

	constructor(scene, texture_scene_death, texture_scene_player1, texture_scene_player2){
		super(gameConfig.width / 2, gameConfig.Textboard.height / 2);
		this.#scene = scene;

		this.#resize_textboard();
		this.#createComponents(texture_scene_death, texture_scene_player1, texture_scene_player2);
		
		
	}
		#resize_textboard(){
			this.width = gameConfig.width;
			this.height = gameConfig.Textboard.height;
		}
		#createComponents(texture_scene_death, texture_scene_player1, texture_scene_player2){
			this.#createPlayerScores(texture_scene_death, texture_scene_player1, texture_scene_player2);
			this.#createClock();

		}
			#createPlayerScores(texture_scene_death, texture_scene_player1, texture_scene_player2){
				if (areLivesLimited()){
					this.#score_player1 = new Score (this.#scene, player_index.PLAYER1, texture_scene_death);
					this.#score_player2 = new Score (this.#scene, player_index.PLAYER2, texture_scene_death);
				}
				else{
					this.#score_player1 = new Score (this.#scene, player_index.PLAYER1, texture_scene_player1);
					this.#score_player2 = new Score (this.#scene, player_index.PLAYER2, texture_scene_player2);
				}
			}
			#createClock(){
				if (isTimeLimited()){
					this.#clock = new Timer(this.#scene, 0, 0, gameMode.maxTime);
				} else{
					this.#clock = new Chronometer(this.#scene, 0, 0)
				}
			}

}