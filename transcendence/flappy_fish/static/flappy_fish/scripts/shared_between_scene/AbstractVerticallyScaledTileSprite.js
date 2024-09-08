class AbstractVerticallyScaledTileSprite {
	scene_texture;
	object;

	#init_x;
	#init_y;
	#init_width;
	#init_height;
	#init_depth;

	constructor(scene_texture, x, y, width, height, depth){
		if (this.constructor === AbstractVerticallyScaledTileSprite){
			throw new Error("Can't instantiate AbstractVerticallyScaledTileSprite, it is an abstract class")
		}

		this.scene_texture = scene_texture;
		this.#init_x = x;
		this.#init_y = y;
		this.#init_width = width;
		this.#init_height = height;
		this.#init_depth = depth;

		this.#createObject();
	}

	#createObject(){
		this.object = this.scene_texture.createTileSpriteScaledVertically(this.#init_x, this.#init_y, this.#init_width, this.#init_height);
		this.object.setOrigin(0, 0);
		this.object.depth = this.#init_depth;
	}
}