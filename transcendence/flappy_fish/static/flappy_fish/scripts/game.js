const assets_path = static_url + "flappy_fish/assets/"
const gameTextures = {
		pipe: {
			core : new Texture("pipe_core", "images/pipe_core.png", "image", 230, 460),
			head: new Texture("pipe_head", "images/pipe_head.png", "image", 250, 120),
		},
		pipe_spacer: new Texture("pipe_spacer", "images/pipe_spacer.png", "image", 1024, 884),
		player1: new Texture("player1", "images/bird.png", "image", 816, 576),
		player2: new Texture("player2", "images/bird1.png", "image", 816, 576),
		ground: new Texture("ground", "images/ground.png", "image", 336, 112),
		background: new Texture("background", "images/background.png", "image", 1781, 1785),
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

	width: 1920 * 1.5,
	height: 1200 * 1.5,

	controls: {
		player1: Phaser.Input.Keyboard.KeyCodes.SPACE,
		player2: Phaser.Input.Keyboard.KeyCodes.ENTER
	},
	velocity_x: {
		init_value: 350,
		acceleration: 0,
	},

	player: {
		width: 816 * 0.15,
		height: 576 * 0.15,
		alpha: 0.7,   
		position_x: 100,
		gravity_intensity: 3000,
		jump_strength : 800,
	},
	ground: {
		height: 200,
		speed_factor : 1
	},
	pipe :{
		head_width : 250 * 0.7,
		head_height: 120 * 0.7,
		core_width: 230 * 0.7,
	},
	pipe_spacer: {
		height_default: 350,
		height_min : 0,
		height_max: 900,
		width: 100,
	},
	pipe_repartition: {
		vertical_offset_max: 300,
		horizontal_distance_default: 600,
		horizontal_distance_max: 1500,
		horizontal_distance_min: 200,
	},

	
	scale: {
		autoCenter: Phaser.Scale.CENTER_BOTH,
		mode: Phaser.Scale.FIT
	},
	depth: {
		ground: 0,
		pipes: -1,
		players: -1,
		background: -2
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