class SceneBoot extends Phaser.Scene{
	#scene_textures

	constructor(){
		super("bootGame");
		this.#constructTextures();
	}
		#constructTextures(){
			this.#scene_textures = {
				pipe_core:		new SceneTexture(this,	"pipe_core",	gameTextures.pipe.core),
				pipe_head:		new SceneTexture(this,	"pipe_head",	gameTextures.pipe.head),
				pipe_spacer:	new SceneTexture(this,	"pipe_spacer",	gameTextures.pipe_spacer),
				player1:		new SceneTexture(this,	"player1",		gameTextures.player1),
				player2:		new SceneTexture(this,	"player2",		gameTextures.player2),
				ceiling:		new SceneTexture(this,	"ceiling",		gameTextures.ceiling),
				ground:			new SceneTexture(this,	"ground",		gameTextures.ground),
				background:		new SceneTexture(this,	"background",	gameTextures.background),
				death:			new SceneTexture(this,	"death",		gameTextures.death),
				explosion:		new SceneTexture(this,	"explosion",		gameTextures.explosion),
				textboard:		new SceneTexture(this,	"textboard",	gameTextures.textboard),
				starting_line:	new SceneTexture(this,	"starting_line",	gameTextures.starting_line)
			}
		}

	//=== preload ===

	preload(){
		this.#preloadAllSceneTextures();
	}

	#preloadAllSceneTextures(){
		for (const [key, value] of Object.entries(this.#scene_textures)){
			value.preloadOnScene();
		}		
	}

	create(){
		this.scene.start("playGame", this.#scene_textures);
	}

}