const assets_path = static_url + "pong/assets/"
const gameTextures = {
	background:	new Texture("images/background_sky.jpg",	"image", 1920, 1080),
	// ball:		new Texture("images/to_dell.png",		"image", 225, 224),
}
const MenuAndGameOverTextures = {
	background:		new Texture("images/background_sky.jpg",		"image", 1920, 1080),
	player_icon:	new Texture("images/profile_icon.png",	"image", 676, 676),
	bot_icon:		new Texture("images/bot_icon.png",		"image", 828, 828),
	confetti:		new Texture("sprites/confetti.png",			"sprite", 150, 84, 25, -1),
}


let gameMode = {
	activeBoosters: [],
	maxTime: 30,
	maxPoints: -1,
	username_player1: "username1",
	username_player2: "username2",
	bot_level: -1,
}

const gameConfig = {
	title: "custom_pong",
	version: 0.1,
	
	parent: "phaser_pong_game", //html DOM element or id
	scene: [SceneBoot, SceneMenu, ScenePlay, SceneGameFinished],

	
	width: 1200 * 2.25,
	height: 800 * 2.25,

	scene_menu: {
		padding:{
			top: 100,
			under_panels: 50,
			under_time_limit: 30,
			under_button: 100
		},
		player_panel:{
			icon_size: 400,
			icon_angle: 30,
			icon_bottom_padding: 30,
			line_spacing: 30, 
		},
		text_style:{
			fontFamily: '"Goudy Bookletter 1911", Times, serif',
			fontSize: '150px',
			fill: 'white'
		},
		button_style:{
			margin : 50,
			text:{
				fontFamily: '"Goudy Bookletter 1911", Times, serif',
				fontSize: '150px',
				fill: 'black'
			},
			shape:{
				fill_color: 0xffffff,
				fill_alpha: 1,
				line_color: 0xffff00,
				line_alpha: 1,
				line_width: 15
			}
		},
		depths: {
			background: -1,
			player_panels: 0,
			time_limit: 0,
			points_limit: 0,
			button: 0
		}
	},

	scene_play: {
		player: {
			max_speed: 1000,
			paddle_length: 300,
			paddle_width: 60,
			distance_to_border: 100,
			color:{
				left: 0xFF0000,
				right: 0xFF00
			},
			alpha:{
				left: 1,
				right: 1
			},
			controls:{
				left: {
					up: {key_name: "W", key_code: Phaser.Input.Keyboard.KeyCodes.W},
					down: {key_name: "S", key_code: Phaser.Input.Keyboard.KeyCodes.S}
				},
				right : {
					up: {key_name: "UP", key_code: Phaser.Input.Keyboard.KeyCodes.UP},
					down: {key_name: "DOWN", key_code:Phaser.Input.Keyboard.KeyCodes.DOWN}
				},
			},
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
			fontFamily: '"Goudy Bookletter 1911", Times, serif',
			fontSize: '200px',
			fill: 'white',
			padding_top: 50
		},

		depths: {
			background: 5,
			bounce_border: 4,
			death_border: 3,
			score: 1,
			clock: 1,
			paddles:0,
			balls: 0
		}
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