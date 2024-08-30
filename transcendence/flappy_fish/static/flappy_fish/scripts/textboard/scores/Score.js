
class Score extends Phaser.GameObjects.Container{
	#scene;
	#player_index;
	#icon;
	#text;

	constructor(scene, player_index, icon_name, icon_type){
		super(scene);
		this.#scene = scene;
		this.#player_index = player_index;
		if (gameConfig)
			this.icon_name = this.#scene.add.image()
	}
		#addText(){
			this.#text = new ScoreText(this.#scene, this.#player_index);
		}
		#addIcon(icon_name, icon_type){
			
		}

	
}