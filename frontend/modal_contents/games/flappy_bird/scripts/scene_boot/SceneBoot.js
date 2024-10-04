class fb_SceneBoot extends Phaser.Scene{
	#scene_play_textures
	#scene_menu_and_game_over_textures

	constructor(){
		super("fb_bootGame");
		this.#constructScenePlayTextures();
		this.#constructSceneGameOverTextures();
	}
		#constructScenePlayTextures(){
			this.#scene_play_textures = {
				pipe_core:		new SceneTexture(this,	"pipe_core",		fb_gameTextures.pipe.core),
				pipe_head:		new SceneTexture(this,	"pipe_head",		fb_gameTextures.pipe.head),
				pipe_spacer:	new SceneTexture(this,	"pipe_spacer",		fb_gameTextures.pipe_spacer),
				player1:		new SceneTexture(this,	"player1",			fb_gameTextures.player1),
				player2:		new SceneTexture(this,	"player2",			fb_gameTextures.player2),
				ceiling:		new SceneTexture(this,	"ceiling",			fb_gameTextures.ceiling),
				ground:			new SceneTexture(this,	"ground",			fb_gameTextures.ground),
				background:		new SceneTexture(this,	"background",		fb_gameTextures.background),
				death:			new SceneTexture(this,	"death",			fb_gameTextures.death),
				explosion:		new SceneTexture(this,	"explosion",		fb_gameTextures.explosion),
				textboard:		new SceneTexture(this,	"textboard",		fb_gameTextures.textboard),
				starting_line:	new SceneTexture(this,	"starting_line",	fb_gameTextures.starting_line)
			}
		}
		#constructSceneGameOverTextures(){
			this.#scene_menu_and_game_over_textures = {
				player1_icon:	new SceneTexture(this,	"player1",		fb_MenuAndGameOverTextures.player1_icon),
				player2_icon:	new SceneTexture(this,	"player2",		fb_MenuAndGameOverTextures.player2_icon),
				ceiling:		new SceneTexture(this,	"ceiling",			fb_gameTextures.ceiling),
				ground:			new SceneTexture(this,	"ground",			fb_gameTextures.ground),
				background:		new SceneTexture(this,	"background",		fb_gameTextures.background),
				confetti:		new SceneTexture(this,	"confetti",		fb_MenuAndGameOverTextures.confetti),
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
		this.scene.start("fb_Menu", boot_textures);
	}

}