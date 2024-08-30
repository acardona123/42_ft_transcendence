class Texture {

	path;
	type;
	width;
	height;
	frameRates;
	repeat;

	constructor(path, type, width, height, frameRates = 20, repeat = -1){
		const allowedTypes = ["image", "sprite"];
		if (!allowedTypes.includes(type)){
			throw new Error("Invalid texture type. Allowed types are 'image' or 'sprite'.");
		}
		this.path = assets_path + path;
		this.type = type;
		this.width = width;
		this.height = height;
		this.frameRates = frameRates;
		this.repeat = repeat
	}
}