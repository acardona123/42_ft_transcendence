class pg_SceneBoot extends Phaser.Scene{
	#scene_play_textures;
	#scene_menu_and_game_over_textures;

	constructor(){
		super("pg_bootGame");
		this.#constructScenePlayTextures();
		this.#constructSceneGameOverTextures();
	}
	#constructScenePlayTextures(){
		this.#scene_play_textures = {
			background:		new SceneTexture(this, "background", pg_gameTextures.background),
		}
	}
	#constructSceneGameOverTextures(){
		this.#scene_menu_and_game_over_textures = {
			player_icon:	new SceneTexture(this, "player_icon",	pg_MenuAndGameOverTextures.player_icon),
			bot_icon:		new SceneTexture(this, "bot_icon",		pg_MenuAndGameOverTextures.bot_icon),
			background:		new SceneTexture(this, "background",	pg_MenuAndGameOverTextures.background),
			confetti:		new SceneTexture(this, "confetti",		pg_MenuAndGameOverTextures.confetti)
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
		this.scene.start("pg_Menu", boot_textures);
	}


}