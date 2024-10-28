class fb_SceneBoot extends Phaser.Scene{
	#scene_play_textures;
	#scene_pause_textures;
	#scene_menu_and_game_over_textures;

	constructor(){
		super(fb_gameConfig.scene_boot.name);
		this.#constructScenePlayTextures();
		this.#constructScenePauseTextures();
		this.#constructSceneGameOverTextures();
		init_custom_event();
	}
		#constructScenePlayTextures(){
			this.#scene_play_textures = {
				pipe_core:		new SceneTexture(this,	"play_pipe_core",		fb_gameTextures.pipe.core),
				pipe_head:		new SceneTexture(this,	"play_pipe_head",		fb_gameTextures.pipe.head),
				pipe_spacer:	new SceneTexture(this,	"play_pipe_spacer",		fb_gameTextures.pipe_spacer),
				player1:		new SceneTexture(this,	"play_player1",			fb_gameTextures.player1),
				player2:		new SceneTexture(this,	"play_player2",			fb_gameTextures.player2),
				ceiling:		new SceneTexture(this,	"play_ceiling",			fb_gameTextures.ceiling),
				ground:			new SceneTexture(this,	"play_ground",			fb_gameTextures.ground),
				background:		new SceneTexture(this,	"play_background",		fb_gameTextures.background),
				death:			new SceneTexture(this,	"play_death",			fb_gameTextures.death),
				explosion:		new SceneTexture(this,	"play_explosion",		fb_gameTextures.explosion),
				textboard:		new SceneTexture(this,	"play_textboard",		fb_gameTextures.textboard),
				starting_line:	new SceneTexture(this,	"play_starting_line",	fb_gameTextures.starting_line)
			}
		}
		#constructScenePauseTextures(){
			this.#scene_pause_textures = {
				background:		new SceneTexture(this, "pause_background", fb_gameTextures.background),
			}
		}
		#constructSceneGameOverTextures(){
			this.#scene_menu_and_game_over_textures = {
				player1_icon:	new SceneTexture(this,	"menus_player1",		fb_MenuAndGameOverTextures.player1_icon),
				player2_icon:	new SceneTexture(this,	"menus_player2",		fb_MenuAndGameOverTextures.player2_icon),
				ceiling:		new SceneTexture(this,	"menus_ceiling",		fb_MenuAndGameOverTextures.ceiling),
				ground:			new SceneTexture(this,	"menus_ground",		fb_MenuAndGameOverTextures.ground),
				background:		new SceneTexture(this,	"menus_background",	fb_MenuAndGameOverTextures.background),
				confetti:		new SceneTexture(this,	"menus_confetti",		fb_MenuAndGameOverTextures.confetti),
			}
		}
	

	//=== preload ===

	preload(){
		this.#preloadAllTexturesFromMap(this.#scene_play_textures);
		this.#preloadAllTexturesFromMap(this.#scene_pause_textures);
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
			scenePause: this.#scene_pause_textures,
			sceneGameOver: this.#scene_menu_and_game_over_textures
		}
		this.scene.start(fb_gameConfig.scene_menu.name, boot_textures);
	}

}