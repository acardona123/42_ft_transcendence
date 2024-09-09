const assets_path = static_url + "flappy_fish/assets/"
const gameTextures = {
		pipe: {
			core :		new Texture("images/pipe_core.png", "image", 230, 460),
			head:		new Texture("images/pipe_head.png", "image", 250, 120),
		},
		pipe_spacer:	new Texture("images/pipe_spacer.png", "image", 1024, 884),
		player1:		new Texture("images/bird.png", "image", 816, 576),
		player2:		new Texture("images/bird1.png", "image", 816, 576),
		ceiling:		new Texture("images/ceiling.png", "image", 336, 112),
		ground:			new Texture("images/ground.png", "image", 336, 112),
		background:		new Texture("images/background.png", "image", 1781, 1785),
		death:			new Texture("images/death.png", "image", 2118, 2256),
		explosion:		new Texture("sprites/explosion.png", "sprite", 16, 16, 10, 0, true),
		textboard:		new Texture("images/plank.jpg", "image", 256, 256),
		starting_line:	new Texture("images/starting_line.png", "image", 100, 100),
	}

const gameOverTextures = {
		player1_icon:		new Texture("images/bird.png", "image", 816, 576),
		player2_icon:		new Texture("images/bird1.png", "image", 816, 576),
		ceiling:			new Texture("images/ceiling.png", "image", 336, 112),
		ground:				new Texture("images/ground.png", "image", 336, 112),
		background:			new Texture("images/background.png", "image", 1781, 1785),
		confetti:			new Texture("sprites/confetti.png", "sprite", 150, 84, 25, -1),
}

let gameMode = {
	activeBoosters: [],
	maxTime: 20,
	maxDeath: 10,
	players:[],
	bot_level: -1,
}

const gameConfig = {
	title: "flappy_fish",
	version: 0.1,
	
	parent: "phaser_flappy_fish_game", //html DOM element or id
	// scene: [SceneTest, SceneBoot, ScenePlay, SceneGameFinished],
	scene: [SceneBoot, ScenePlay, SceneGameFinished],

	width: 1200 * 2.25,
	height: 800 * 2.25,

	scenePlay:{
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
			alpha: 1,   
			position_x: 100,
			gravity_intensity: 3000,
			jump_strength : 800,
		},
		ceiling :{
			height : 100,
			speed_factor: 1
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
			height_default: 300,
			height_min : 0,
			height_max: 900,
			width: 100,
		},
		pipe_repartition: {
			vertical_offset_max: 350,
			horizontal_distance_default: 500,
			horizontal_distance_max: 1500,
			horizontal_distance_min: 200,
		},
		starting_line: {
			width: 100,
			alpha: 0.9
		},
		textboard: {
			height: 200,
			side_padding: 30,
			icon_size: 175,
			icon_padding: 30,
			text_style: {
				fontFamily: '"Goudy Bookletter 1911", Times, serif',
				fontSize: '150px',
				fill: 'black'
			}
		},
		depth: {
			textboard: 1,
			ceiling: 0,
			ground: 0,
			pipes: -1,
			players: -1,
			starting_line: -2,
			background: -3
		},
	},

	scene_game_finished :{
		padding:{
			top: 150,
			under_panels: 30
		},
		panel:{
			icon_size: 300,
			icon_bottom_padding: 0,
			line_spacing: 30, 
			cellebration: {
				jump_height: 60,
				jump_duration: 300,
				jump_angle: 5,
				bounce_duration: 600,
				loop_delay: 100
			},
			defeat: {
				kneeing_angle: 30,
				kneeing_translation_y: 20 
			}
		},
		ceiling :{
			height : 100,
		},
		ground: {
			height: 100,
		},
		text_style: {
			fontFamily: '"Goudy Bookletter 1911", Times, serif',
			fontSize: '150px',
			fill: 'black'
		},
		depth: {
			confetti: 2,
			panel: 1,
			game_duration: 1,
			ceiling: 0,
			ground: 0,
			background: -3
		},
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
