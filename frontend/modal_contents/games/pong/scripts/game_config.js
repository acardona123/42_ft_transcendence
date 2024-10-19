const pg_size_ratio = 0.5

function pg_resize(value){
	return Math.floor(value * pg_size_ratio)
} 

const pg_gameConfig = {
	title: "custom_pong",
	version: 0.1,
	
	parent: "phaser_game", //html DOM element or id
	scene: [pg_SceneBoot, pg_SceneMenu, pg_ScenePlay, pg_ScenePause, pg_SceneGameFinished],

	
	width: pg_resize(1200 * 2.25),
	height: pg_resize(800 * 2.25),

	scene_menu: {
		padding:{
			top: pg_resize(100),
			under_panels: pg_resize(50),
			under_time_limit: pg_resize(30),
			under_button: pg_resize(100)
		},
		player_panel:{
			icon_size: pg_resize(400),
			icon_angle: pg_resize(30),
			icon_bottom_padding: pg_resize(30),
			line_spacing: pg_resize(30), 
		},
		text_style:{
			fontFamily: '"Goudy Bookletter 1911", Times, serif',
			fontSize: '' + pg_resize(150) + 'px',
			fill: 'white'
		},
		button_style:{
			margin : pg_resize(50),
			text:{
				fontFamily: '"Goudy Bookletter 1911", Times, serif',
				fontSize: '' + pg_resize(150) + 'px',
				fill: 'black'
			},
			shape:{
				fill_color: 0xffffff,
				fill_alpha: 1,
				line_color: 0xffff00,
				line_alpha: 1,
				line_width: pg_resize(15)
			}
		},
		depths: {
			background: -1,
			player_panels: 0,
			time_limit: 0,
			points_limit: 0,
			button: 1
		}
	},

	scene_play: {
		player: {
			max_speed: pg_resize(1000),
			paddle_length: pg_resize(300),
			paddle_width: pg_resize(60),
			distance_to_border: pg_resize(100),
			color:{
				left: 0xFF0000,
				right: 0xFF
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
		bot: {
			position_epsilon: 20,
			calculous_period_min: 1000
		},
		ball: {
			default_radius: pg_resize(50),
			default_color: 0xFFFFFF,
			default_alpha: 1,
			init_velocity: pg_resize(750),
			max_bounce_angle: pg_resize(45), //degrees
			bounce_coefficient: 1.1,
		},
		border: {
			color: 0x6666ff,
			alpha: 0.5,
			thickness: pg_resize(50) 
		},
		score: {
			font: '"Goudy Bookletter 1911", Times, serif',
			fontSize: '' + pg_resize(300) + 'px',
			color: 'white',
			eccentricity: pg_resize(100)
		},
		clock: {
			fontFamily: '"Goudy Bookletter 1911", Times, serif',
			fontSize: '' + pg_resize(200) + 'px',
			fill: 'white',
			padding_top: pg_resize(50)
		},
		pause: {
			control : {key_name: "ESCAPE", key_code: Phaser.Input.Keyboard.KeyCodes.ESC}
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

	scene_pause: {
		padding:{
			top: pg_resize(400),
			under_text: pg_resize(150),
			between_buttons: pg_resize(100)
		},
		text_style:{
			fontFamily: '"Goudy Bookletter 1911", Times, serif',
			fontSize: '' + pg_resize(150) + 'px',
			fill: 'white'
		},
		button_style:{
			margin : pg_resize(50),
			text:{
				fontFamily: '"Goudy Bookletter 1911", Times, serif',
				fontSize: '' + pg_resize(150) + 'px',
				fill: 'black'
			},
			shape:{
				fill_color: 0xffffff,
				fill_alpha: 1,
				line_color: 0xffff00,
				line_alpha: 1,
				line_width: pg_resize(15)
			},
		},
		resume: {
			control : {key_name: "ESCAPE", key_code: Phaser.Input.Keyboard.KeyCodes.ESC}
		},
		depths: {
			background: -1,
			text: 0,
			buttons: 0
		}
	},

	scene_game_finished :{
		padding:{
			top: pg_resize(300),
			under_panels: pg_resize(30),
			under_match_duration: pg_resize(150)
		},
		panel:{
			icon_size: pg_resize(300),
			icon_bottom_padding: pg_resize(30),
			line_spacing: pg_resize(30), 
			celebration: {
				jump_height: pg_resize(60),
				jump_duration: 300,
				jump_angle: 5,
				bounce_duration: 600,
				loop_delay: 100
			},
			defeat: {
				kneeing_angle: 30,
				kneeing_translation_y: pg_resize(20)
			}
		},
		text_style: {
			fontFamily: '"Goudy Bookletter 1911", Times, serif',
			fontSize: '' + pg_resize(150) + 'px',
			fill: 'white'
		},
		button_style:{
			margin : pg_resize(50),
			text:{
				fontFamily: '"Goudy Bookletter 1911", Times, serif',
				fontSize: '' + pg_resize(150) + 'px',
				fill: 'black'
			},
			shape:{
				fill_color: 0xffffff,
				fill_alpha: 1,
				line_color: 0xffff00,
				line_alpha: 1,
				line_width: pg_resize(15)
			}
		},
		depths: {
			button: 3,
			confetti: 2,
			panel: 1,
			match_duration: 1,
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

	disableContextMenu: true,
	
	physics: {
		default: "arcade",
		arcade: {
			debug: false
		}
	},

	type: Phaser.WEBGL,
	antialias: false,
	powerPreference: 'high-performance',
	
	//audio:
}
