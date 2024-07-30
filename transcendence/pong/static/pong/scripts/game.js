var gameSettings = {
	ball_init_velocity: 100,
	pad_default_size: 200,
	pad_default_velocity: 200,
	player_color_default: "white"
}

var assets_path = static_url + "pong/assets/"
var gameTextures = {
	background: new Texture("background_classic", "images/background.jpeg", "image", 256, 272),
	ball: new Texture("ball_pacman", "images/to_dell.png", "image", 225, 224),
	// ball: new Texture("ball_pacman", "images/pacman.png", "image", 2000, 2000),
}

var gameMode = {
	activeBoosters: [],
	maxTime: -1,
	maxPoints: -1,
	players:[],
	bot_level: -1,
}

var gameConfig = {
	title: "custom_pong",
	version: 0.1,
	
	parent: "phaser_pong_game", //html DOM element or id
	scene: [SceneBoot, ScenePlay],

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