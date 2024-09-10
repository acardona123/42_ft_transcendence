class SceneBoot extends Phaser.Scene{
	#scene_play_textures;
	#scene_menu_and_game_over_textures;

	constructor(){
		super("bootGame");
		this.#constructScenePlayTextures();
		this.#constructSceneGameOverTextures();
	}
	#constructScenePlayTextures(){
		this.#scene_play_textures = {
			background:		new SceneTexture(this, "background", gameTextures.background),
		}
	}
	#constructSceneGameOverTextures(){
		this.#scene_menu_and_game_over_textures = {
			player_icon:	new SceneTexture(this, "player_icon",	MenuAndGameOverTextures.player_icon),
			bot_icon:		new SceneTexture(this, "bot_icon",		MenuAndGameOverTextures.bot_icon),
			background:		new SceneTexture(this, "background",	MenuAndGameOverTextures.background),
			confetti:		new SceneTexture(this, "confetti",		MenuAndGameOverTextures.confetti)
		}
	}

	//=== preload ===

	preload(){
		this.#preloadAllTexturesFromMap(this.#scene_play_textures);
		this.#preloadAllTexturesFromMap(this.#scene_menu_and_game_over_textures);
	}

	#preloadAllTexturesFromMap(texture_map){
		for (const [key, value] of Object.entries(texture_map)){
			value.preloadOnScene();
		}
	}

	create(){
		let boot_textures = {
			sceneMenu: this.#scene_menu_and_game_over_textures,
			scenePlay: this.#scene_play_textures,
			sceneGameOver: this.#scene_menu_and_game_over_textures
		}
		this.scene.start("Menu", boot_textures);
	}


}