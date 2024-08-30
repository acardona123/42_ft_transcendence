class SceneTexture{
	scene;
	name;
	texture;

	#texture_name;
	#animation_name;
	#images_loaded;
	#animation_loaded;

	constructor(scene, name, texture){
		this.scene = scene;
		this.name = name;
		this.texture = texture;
		this.#texture_name = name + "_texture";
		this.#animation_name = name + "_anim";
		this.#images_loaded = false;
		this.#animation_loaded = false;

	}

	preloadOnScene(){
		if (this.#images_loaded){
			return;
		}
		if (this.texture.type === "image"){
			this.scene.load.image(this.#texture_name, this.texture.path);
		} else if (this.texture.type === "sprite"){
			this.scene.load.spritesheet(this.#texture_name, this.texture.path, {frameWidth: this.texture.width, frameHeight: this.texture.height});
		}
		this.#images_loaded = true;
	}
	#implicitPreloadOnScene(){
		console.log(`Warning: implicit texture preload for ${this.name}`);
		this.preloadOnScene();
	}

	createAnimationOnScene(){
		if (!this.#images_loaded){
			this.#implicitPreloadOnScene();
		}
		if (this.texture.type === "sprite"){
			this.scene.anims.create({
				key: this.#animation_name,
				frames: this.scene.anims.generateFrameNumbers(this.#texture_name),
				frameRate: this.texture.frameRates,
				repeat: this.texture.repeat,
			});
			this.#animation_loaded = true;
		}
	}
	#implicitCreateAnimationOnScene(){
		console.log("Warning: animation creation for ${this.name}");
		this.createAnimationOnScene();
	}

	createOnScene(x = 0, y = 0, addToPhysics = false){
		if (!this.#images_loaded){
			this.#implicitPreloadOnScene();
		}

		let target = (addToPhysics === true) ? this.scene.physics : this.scene;
		if (this.texture.type === "image"){
			return (target.add.image(x, y, this.#texture_name));
		} else {
			return (target.add.sprite(x, y, this.#texture_name));
		}
	}

	createTileSprite(x = 0, y = 0, width = gameConfig.width, height = gameConfig.height){
		if (!this.#images_loaded){
			this.#implicitPreloadOnScene();
		}
		return (this.scene.add.tileSprite(x, y, width, height, this.#texture_name));
	}

	createTileSpriteScaledVertically(x = 0, y = 0, width = gameConfig.width, height = gameConfig.height){
		const unscaled_height = this.texture.height;
		let object = this.createTileSprite(x, y, width, unscaled_height, this.#texture_name);
		object.setScale(1, height / this.texture.height);
		return (object);
	}

	createTileSpriteScaledHorizontally(x = 0, y = 0, width = gameConfig.width, height = gameConfig.height){
		const unscaled_width = this.texture.width;
		let object = this.createTileSprite(x, y, unscaled_width, height, this.#texture_name);
		object.setScale(width / this.texture.width, 1);
		return (object);
	}

	isAnimated(){
		return (this.#animation_loaded);
	}

	playAnimationOn(object){
		if (this.texture.type === "sprite"){
			if (!this.#images_loaded){
				this.#implicitPreloadOnScene();
			}
			if (!this.#animation_loaded){
				this.#implicitCreateAnimationOnScene();
			}
			object.play(this.#animation_name);
		}
	}
}