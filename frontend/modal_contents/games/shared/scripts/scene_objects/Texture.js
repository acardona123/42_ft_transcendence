class Texture {

	path;
	type;
	width;
	height;
	frameRates;
	repeat;
	hide_on_complete;

	constructor(path, type, width, height, frameRates = 20, repeat = -1, hide_on_complete = false){
		const allowedTypes = ["image", "sprite"];
		if (!allowedTypes.includes(type)){
			throw new Error("Invalid texture type. Allowed types are 'image' or 'sprite'.");
		}
		this.path = path;
		this.type = type;
		this.width = width;
		this.height = height;
		this.frameRates = frameRates;
		this.repeat = repeat;
		this.hide_on_complete = hide_on_complete;
	}
}