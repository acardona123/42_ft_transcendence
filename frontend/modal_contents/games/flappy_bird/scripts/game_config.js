const fb_size_ratio = 0.5

function fb_resize(value){
	return Math.floor(value * fb_size_ratio)
} 

const fb_gameConfig = {
	title: "flappy_bird",
	version: 0.1,
	
	parent: "phaser_flappy_bird_game", //html DOM element or id
	// scene: [SceneTest, fb_SceneBoot, ScenePlay, fb_SceneGameFinished],
	scene: [fb_SceneBoot, fb_SceneMenu, fb_ScenePlay, fb_SceneGameFinished],

	width: fb_resize(1200 * 2.25),
	height: fb_resize(800 * 2.25),

	scene_menu:{
		padding:{
			top: fb_resize(50),
			under_panels: fb_resize(30),
			under_time_limit: fb_resize(30),
			under_deaths_limit: fb_resize(40)
		},
		panel:{
			icon_size: fb_resize(300),
			icon_bottom_padding: fb_resize(0),
			line_spacing: fb_resize(30), 
		},
		ceiling:{
			height : fb_resize(100),
		},
		ground:{
			height: fb_resize(100),
		},
		text_style:{
			fontFamily: '"Goudy Bookletter 1911", Times, serif',
			fontSize: '' + fb_resize(150) + 'px',
			fill: 'black'
		},
		button_style:{
			margin : fb_resize(50),
			text:{
				fontFamily: '"Goudy Bookletter 1911", Times, serif',
				fontSize: '' + fb_resize(150) + 'px',
				fill: 'black'
			},
			shape:{
				fill_color: 0xffffff,
				fill_alpha: 1,
				line_color: 0xffff00,
				line_alpha: 1,
				line_width: fb_resize(20)
			}
		},
		depth:{
			background: -1,
			ceiling: 0,
			ground: 0,
			panel: 1,
			match_duration: 1,
			death_limit: 1,
			button: 2,
		},
	},

	scenePlay:{
		controls:{
			player1: Phaser.Input.Keyboard.KeyCodes.SPACE,
			player2: Phaser.Input.Keyboard.KeyCodes.ENTER
		},
		velocity_x:{
			init_value: fb_resize(350),
			acceleration: fb_resize(0),
		},

		player:{
			width: fb_resize(816 * 0.15),
			height: fb_resize(576 * 0.15),
			alpha: 1,   
			position_x: fb_resize(100),
			gravity_intensity: fb_resize(3000),
			jump_strength : fb_resize(800),
		},
		ceiling :{
			height : fb_resize(100),
			speed_factor: 1
		},
		ground:{
			height: fb_resize(100),
			speed_factor : 1
		},
		pipe :{
			head_width : fb_resize(250 * 0.7),
			head_height: fb_resize(120 * 0.7),
			core_width: fb_resize(230 * 0.7),
		},
		pipe_spacer:{
			height_default: fb_resize(300),
			height_min : fb_resize(0),
			height_max: fb_resize(900),
			width: fb_resize(100),
		},
		pipe_repartition:{
			vertical_offset_max: fb_resize(350),
			horizontal_distance_default: fb_resize(500),
			horizontal_distance_max: fb_resize(1500),
			horizontal_distance_min: fb_resize(200),
		},
		starting_line:{
			width: fb_resize(100),
			alpha: 0.9
		},
		textboard:{
			height: fb_resize(200),
			side_padding: fb_resize(30),
			icon_size: fb_resize(175),
			icon_padding: fb_resize(30),
			text_style:{
				fontFamily: '"Goudy Bookletter 1911", Times, serif',
				fontSize: '' + fb_resize(150) + 'px',
				fill: 'black'
			}
		},
		depth:{
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
			top: fb_resize(150),
			under_panels: fb_resize(30),
			under_match_duration: fb_resize(30)
		},
		panel:{
			icon_size: fb_resize(300),
			icon_bottom_padding: fb_resize(0),
			line_spacing: fb_resize(30), 
			celebration:{
				jump_height: fb_resize(60),
				jump_duration: 300,
				jump_angle: 5,
				bounce_duration: 600,
				loop_delay: 100
			},
			defeat:{
				kneeing_angle: 30,
				kneeing_translation_y: fb_resize(20) 
			}
		},
		ceiling :{
			height : fb_resize(100),
		},
		ground:{
			height: fb_resize(100),
		},
		text_style:{
			fontFamily: '"Goudy Bookletter 1911", Times, serif',
			fontSize: '' + fb_resize(150) + 'px',
			fill: 'black'
		},
		button_style:{
			margin : fb_resize(50),
			text:{
				fontFamily: '"Goudy Bookletter 1911", Times, serif',
				fontSize: '' + fb_resize(150) + 'px',
				fill: 'black'
			},
			shape:{
				fill_color: 0xffffff,
				fill_alpha: 1,
				line_color: 0xffff00,
				line_alpha: 1,
				line_width: fb_resize(20)
			}
		},
		depth:{
			button: 3,
			confetti: 2,
			panel: 1,
			match_duration: 1,
			ceiling: 0,
			ground: 0,
			background: -3
		},
	},
	
	
	scale:{
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
	
	physics:{
		default: "arcade",
		arcade:{
			debug: false
		}
	},
	
	//audio:
}
