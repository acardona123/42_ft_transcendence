class SceneBoot extends Phaser.Scene{
	#scene_play_textures
	#scene_game_over_textures

	constructor(){
		super("bootGame");
		this.#constructScenePlayTextures();
		this.#constructSceneGameOverTextures();
	}
		#constructScenePlayTextures(){
			this.#scene_play_textures = {
				pipe_core:		new SceneTexture(this,	"pipe_core",		gameTextures.pipe.core),
				pipe_head:		new SceneTexture(this,	"pipe_head",		gameTextures.pipe.head),
				pipe_spacer:	new SceneTexture(this,	"pipe_spacer",		gameTextures.pipe_spacer),
				player1:		new SceneTexture(this,	"player1",			gameTextures.player1),
				player2:		new SceneTexture(this,	"player2",			gameTextures.player2),
				ceiling:		new SceneTexture(this,	"ceiling",			gameTextures.ceiling),
				ground:			new SceneTexture(this,	"ground",			gameTextures.ground),
				background:		new SceneTexture(this,	"background",		gameTextures.background),
				death:			new SceneTexture(this,	"death",			gameTextures.death),
				explosion:		new SceneTexture(this,	"explosion",		gameTextures.explosion),
				textboard:		new SceneTexture(this,	"textboard",		gameTextures.textboard),
				starting_line:	new SceneTexture(this,	"starting_line",	gameTextures.starting_line)
			}
		}
		#constructSceneGameOverTextures(){
			this.#scene_game_over_textures = {
				player1_icon:	new SceneTexture(this,	"player1",		gameOverTextures.player1_icon),
				player2_icon:	new SceneTexture(this,	"player2",		gameOverTextures.player2_icon),
				ceiling:		new SceneTexture(this,	"ceiling",			gameTextures.ceiling),
				ground:			new SceneTexture(this,	"ground",			gameTextures.ground),
				background:		new SceneTexture(this,	"background",		gameTextures.background),
				confetti:		new SceneTexture(this,	"confetti",		gameOverTextures.confetti),
			}
		}
	

	//=== preload ===

	preload(){
		this.#preloadAllTexturesFromMap(this.#scene_play_textures);
		this.#preloadAllTexturesFromMap(this.#scene_game_over_textures);
	}

	#preloadAllTexturesFromMap(texture_map){
		for (const [key, value] of Object.entries(texture_map)){
			value.preloadOnScene();
		}		
	}

	create(){
		let boot_textures = {
			scenePlay: this.#scene_play_textures,
			sceneGameOver: this.#scene_game_over_textures
		}
		this.scene.start("playGame", boot_textures);
	}

}