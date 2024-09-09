class SceneMenu extends Phaser.Scene{
	#boot_textures;

	constructor(){
		super ("Menu");
	}

	init (textures){
		this.#boot_textures = textures;
		
	}
}