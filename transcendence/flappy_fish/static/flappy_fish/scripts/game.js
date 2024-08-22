const assets_path = static_url + "flappy_fish/assets/"
const gameTextures = {
		pipe: {
			core : new Texture("pipe_core", "images/pipe_core.png", "image", 230, 460),
			head: new Texture("pipe_head", "images/pipe_head.png", "image", 250, 120),
		},
		pipe_spacer: new Texture("pipe_spacer", "images/pipe_spacer.png", "image", 1024, 884),
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

	pipe : {
		head_width : 250,
		head_height: 120,
		core_width: 230,
	},
	pipe_spacer: {
		height_default: 200,
		height_min : 0,
		height_max: 900,
		width: 1,
		vertical_offset_max: 500
	},
	
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
			debug: true
		}
	},
	
	//audio:
}

var game= new Phaser.Game(gameConfig);