const assets_path = static_url + "flappy_fish/assets/"
const gameTextures = {
		pipe: {
			core : new Texture("pipe_core", "images/pipe_core.png", "image", 230, 460),
			exit: new Texture("pipe_exit", "images/pipe_exit.png", "image", 250, 120)
		}
	}

let gameMode = {
	activeBoosters: [],
	maxTime: -1,
	maxPoints: -1,
	players:[],
	bot_level: -1,
}

const gameConfig = {
	title: "flappy_fish",
	version: 0.1,
	
	parent: "phaser_flappy_fish_game", //html DOM element or id
	scene: [SceneBoot, ScenePlay, SceneGameFinished],

	width: 1920,
	height: 1200,
	
	scale: {
		autoCenter: Phaser.Scale.CENTER_BOTH,
		mode: Phaser.Scale.FIT
	},
	preload: function() {
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
	},
	
	backgroundColor: '#eee', //sides when rescaled, can be written in binary (0x000000)
	pixelArt: true,
	autoFocus: true,

	disableContextMenu: false,//set to true to disable right click menu
	
	physics: {
		default: "arcade",
		arcade: {
			debug: false
		}
	},
	
	//audio:
}

var game= new Phaser.Game(gameConfig);