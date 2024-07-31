class Paddle extends Phaser.GameObjects.Graphics {
	constructor(scene, middleX, middleY, length, width, color = 0xFFFFFF, orientation, alpha = 1){
		super(scene);
		
		const possibleDirections = ["top", "left", "right", "bottom"];
		if (!possibleDirections.includes(orientation)){
			console.log("Error: trying to set a paddle with the wrong orientation");
			throw new Error('Wrong paddle orientation');
		}

		this.orientation = orientation;
		this.middleX = middleX;
		this.middleY = middleY;
		this.length = length;
		this.width = width;
		this.scale = 1;
		
		scene.add.existing(this);
		scene.physics.add.existing(this);
		scene.paddles.add(this);

		this.fillStyle(color, alpha);
		this.#buildRondedRectangle();

		// this.enableBody(true, middleX, middleY, true, true);
		this.body.setCollideWorldBounds(true);
		this.body.immovable = true;
		this.body.setBounce(1);
		this.body.setVelocityX(300);
		this.body.setVelocityY(200);
	}

	#buildRondedRectangle()
	{
		const ratio_radius_width = 3 / 4;
		const angle_radius = Math.min(this.width * ratio_radius_width, this.length / 2);

		let rect_x;
		let rect_y;
		let rect_size_x;
		let rect_size_y;
		let pad_angles_radiuses;

		if (this.orientation === "top"){
			rect_x = this.middleX - this.length / 2;
			rect_y = this.middleY - this.width;
			rect_size_x = this.length;
			rect_size_y = this.width;
			pad_angles_radiuses = {tl:angle_radius, tr:angle_radius, bl:0, br:0};
		}else if (this.orientation === "bottom"){
			rect_x = this.middleX - this.length / 2;
			rect_y = this.middleY;
			rect_size_x = this.length;
			rect_size_y = this.width;
			pad_angles_radiuses = {tl:0, tr:0, bl:angle_radius, br:angle_radius};
		}else if (this.orientation === "right"){
			rect_x = this.middleX;
			rect_y = this.middleY - this.length / 2;
			rect_size_x = this.width;
			rect_size_y = this.length;
			pad_angles_radiuses = {tl:0, tr:angle_radius, bl:0, br:angle_radius};
		}else{// <=> if (this.orientation === "left"){
			rect_x = this.middleX - this.width;
			rect_y = this.middleY - this.length / 2;
			rect_size_x = this.width;
			rect_size_y = this.length;
			pad_angles_radiuses = {tl:angle_radius, tr:0, bl:angle_radius, br:0};
		}

		this.fillRoundedRect(rect_x, rect_y, rect_size_x, rect_size_y, pad_angles_radiuses);
		this.body.setSize(rect_size_x, rect_size_y);
		this.body.setOffset(rect_x, rect_y);
	}
}