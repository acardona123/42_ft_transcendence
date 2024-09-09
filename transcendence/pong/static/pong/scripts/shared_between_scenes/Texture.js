class Texture {
	constructor(name, path, type, width, height, frameRates = 20, repeat = -1){
		const allowedTypes = ["image", "sprite"];
		if (!allowedTypes.includes(type)){
			throw new Error("Invalid texture type. Allowed types are 'image' or 'sprite'.");
		}
		this.name = name;
		this.path = path;
		this.type = type;
		this.width = width;
		this.height = height;
		this.frameRates = frameRates;
		this.repeat = repeat
	}

	preloadOnScene(scene, name){
		if (this.type === "image"){
			scene.load.image(name, assets_path + this.path);
		} else if (this.type === "sprite"){
			scene.load.spritesheet(name, assets_path + this.path, {frameWidth: this.width, frameHeight: this.height});
		}
	}

	createAnimationOnScene(scene, sprite_name){
		if (this.type === "sprite"){
			scene.anims.create({
				key: sprite_name + "_anim",
				frames: scene.anims.generateFrameNumbers(sprite_name),
				frameRate: this.frameRates,
				repeat: this.repeat,
			});
		}
	}
}