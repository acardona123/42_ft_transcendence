const pg_assets_path = document.querySelector('base').getAttribute('href') + "pong/assets/"

const pg_gameTextures = {
	background:		new Texture(pg_assets_path + "images/background_sky.jpg",	"image", 1920, 1080),
}

const pg_MenuAndGameOverTextures = {
	background:		new Texture(pg_assets_path + "images/background_sky.jpg",	"image", 1920, 1080),
	player_icon:	new Texture(pg_assets_path + "images/profile_icon.png",		"image", 676, 676),
	bot_icon:		new Texture(pg_assets_path + "images/bot_icon.png",			"image", 828, 828),
	confetti:		new Texture(pg_assets_path + "sprites/confetti.png",		"sprite", 150, 84, 25, -1),
}