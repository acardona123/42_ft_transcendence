
class Score extends Phaser.GameObjects.Container{
	#scene;
	#player_index;
	#icon_scene_texture;
	#icon;
	#text;

	constructor(scene, player_index, icon_scene_texture){
		super(scene);
		this.#scene = scene;
		this.#player_index = player_index;
		this.#icon_scene_texture = icon_scene_texture;
	}
		#addText(){
			this.#text = new ScoreText(this.#scene, this.#player_index);

		}
		#addIcon(){
			this.#icon = this.#icon_scene_texture.createOnScene();
			this.#icon_scene_texture.playAnimationOn(this.#icon);
		}
}