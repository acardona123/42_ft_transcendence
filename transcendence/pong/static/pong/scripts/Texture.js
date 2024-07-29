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
		if (texture.type === "image"){
			this.#preloadImage(scene, name);
		} else if (texture.type === "sprite"){
			this.#preloadSprite(scene, name);
		}
	}

	#preloadImage(scene, name){
		this.load.image(name, assets_path + this.path);
	}

	#preloadSprite(scene, name){
		this.load.spritesheet(name, assets_path + this.path, {frameWidth: this.width, frameHeight: this.height});
		this.anims.create({
			key: name + "_anim",
			frames: this.anims.generateFrameNumbers(name),
			frameRate: this.frameRates,
			repeat: this.repeat,
		});
	}
}