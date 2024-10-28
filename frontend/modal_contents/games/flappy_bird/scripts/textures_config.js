const fb_assets_path = "modal_contents/games/flappy_bird/assets/"

const fb_gameTextures = {
	pipe: {
		core :		new Texture(fb_assets_path + "images/pipe_core.png", "image", 230, 460),
		head:		new Texture(fb_assets_path + "images/pipe_head.png", "image", 250, 120),
	},
	pipe_spacer:	new Texture(fb_assets_path + "images/pipe_spacer.png", "image", 1024, 884),
	player1:		new Texture(fb_assets_path + "images/bird.png", "image", 816, 576),
	player2:		new Texture(fb_assets_path + "images/bird1.png", "image", 816, 576),
	ceiling:		new Texture(fb_assets_path + "images/ceiling.png", "image", 336, 112),
	ground:			new Texture(fb_assets_path + "images/ground.png", "image", 336, 112),
	background:		new Texture(fb_assets_path + "images/background.png", "image", 1781, 1785),
	death:			new Texture(fb_assets_path + "images/death.png", "image", 2118, 2256),
	explosion:		new Texture(fb_assets_path + "sprites/explosion.png", "sprite", 16, 16, 10, 0, true),
	textboard:		new Texture(fb_assets_path + "images/plank.jpg", "image", 256, 256),
	starting_line:	new Texture(fb_assets_path + "images/starting_line.png", "image", 100, 100),
}

const fb_MenuAndGameOverTextures = {
	player1_icon:		new Texture(fb_assets_path + "images/bird.png", "image", 816, 576),
	player2_icon:		new Texture(fb_assets_path + "images/bird1.png", "image", 816, 576),
	ceiling:			new Texture(fb_assets_path + "images/ceiling.png", "image", 336, 112),
	ground:				new Texture(fb_assets_path + "images/ground.png", "image", 336, 112),
	background:			new Texture(fb_assets_path + "images/background_menus.png", "image", 1781, 1785),
	confetti:			new Texture(fb_assets_path + "sprites/confetti.png", "sprite", 150, 84, 25, -1),
}

const fb_PauseTextures = {
	background:		new Texture(fb_assets_path + "images/background_menus.png", "image", 1781, 1785),
}