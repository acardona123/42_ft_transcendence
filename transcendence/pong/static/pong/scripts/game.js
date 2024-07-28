
var config = {
	parent: "phaser_pong_game", //html DOM element or id
	width: 256,
	height: 272,

	title: "custom_pong",
	version: 0.1,
	backgroundColor: 0x000000,
	scene: [],
	pixelArt: true,
	physics: {
		default: "arcade",
		arcade: {
			debug: false
		}
	},
	autoFocus: true,
	disableContextMenu: false,//set to true to disable right click menu
	//audio:
	autocenter: Phaser.Scale.CENTER_BOTH,
	
}

var gameSettings = {
	playerSpeed: 200,
}

var game= new Phaser.Game(config);