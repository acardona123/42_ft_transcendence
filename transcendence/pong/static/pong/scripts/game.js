const assets_path = static_url + "pong/assets/"
const gameTextures = {
	background: new Texture("background_classic", "images/background.jpeg", "image", 256, 272),
	ball: new Texture("ball_pacman", "images/to_dell.png", "image", 225, 224),
	// ball: new Texture("ball_pacman", "images/pacman.png", "image", 2000, 2000),
}

let gameMode = {
	activeBoosters: [],
	maxTime: 30,
	maxPoints: -1,
	players:[],
	bot_level: -1,
}

const gameConfig = {
	title: "custom_pong",
	version: 0.1,
	
	parent: "phaser_pong_game", //html DOM element or id
	scene: [SceneBoot, ScenePlay, SceneGameFinished],

	width: 3000,
	height: 1200,
	player: {
		max_speed: 1000,
		paddle_length: 300,
		paddle_width: 60,
		distance_to_border: 100,
		left: {color: 0xFFFFFF, alpha: 1},
		right: {color: 0xFFFFFF, alpha: 1},
	},
	ball: {
		default_radius: 50,
		default_color: 0xFFFFFF,
		default_alpha: 1,
		init_velocity: 750,
		max_bounce_angle: 45, //degrees
		bounce_coefficient: 1.1,
	},
	border: {
		color: 0x6666ff,
		alpha: 0.5,
		thickness:50 
	},
	score: {
		font: '"Goudy Bookletter 1911", Times, serif',
		fontSize: '300px',
		color: 'white',
		eccentricity: 100
	},
	clock: {
		font: '"Goudy Bookletter 1911", Times, serif',
		fontSize: '200px',
		color: 'white',
		padding_top: 50
	},
	recapText: {
		font: '"Goudy Bookletter 1911", Times, serif',
		fontSize: '200px',
		color: 'white',
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
			debug: false
		}
	},
	
	//audio:
}

var game= new Phaser.Game(gameConfig);