const assets_path = static_url + "flappy_fish/assets/"
const gameTextures = {
		pipe: {
			core : new Texture("pipe_core", "images/pipe_core.png", "image", 230, 460),
			head: new Texture("pipe_head", "images/pipe_head.png", "image", 250, 120),
		},
		// pipe_spacer: new Texture("pipe_spacer", "images/to_dell_test.png", "image", 1536, 2048),
		pipe_spacer: new Texture("pipe_spacer", "images/pipe_spacer.png", "image", 1024, 884),
		ground: new Texture("ground", "images/ground.png", "image", 336, 112),
		player1: new Texture("player1", "images/bird.png", "image", 816, 576),
		player2: new Texture("player2", "images/bird1.png", "image", 816, 576),
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

	controls: {
		player1: Phaser.Input.Keyboard.KeyCodes.SPACE,
		player2: Phaser.Input.Keyboard.KeyCodes.ENTER
	},

	pipes_pool_size: 8,
	player: {
		width: 816 * 0.15,
		height: 576 * 0.15,
		alpha: 0.7,   
		position_x: 100,
		gravity_intensity: 3000,
		jump_strength : 800,
	},
	ground: {
		height: 100,
		speed_factor : 1
	},
	pipe :{
		head_width : 250 * 0.7,
		head_height: 120 * 0.7,
		core_width: 230 * 0.7,
	},
	pipe_spacer: {
		height_default: 200,
		height_min : 0,
		height_max: 900,
		width: 100,
	},
	pipe_repartition: {
		vertical_offset_max: 500,
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
		background: -1
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