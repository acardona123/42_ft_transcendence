class Player{
	#scene;
	#texture;
	#texture_loaded_name;
	object;
	scale;

	constructor(scene, texture_loaded_name, texture){
		this.#scene = scene;
		this.#texture = texture;
		this.#texture_loaded_name = texture_loaded_name;
	
		this.#createObject();
		this.#resizeObject(gameConfig.player.width, gameConfig.player.height);
		this.#addPhysics();
	}

	#createObject(){
		const init_x = gameConfig.player.position_x;
		const init_y = (gameConfig.height - gameConfig.ground.height) / 2
		if (this.#texture.type === "image"){
			this.object = this.#scene.add.image(init_x, init_y, this.#texture_loaded_name);
		} else if (texture.type === "sprite"){
			this.object = this.#scene.add.sprite(init_x, init_y, this.#texture_loaded_name);
		}
	}

	#resizeObject(new_width, new_height){
		this.#rescaleObject();
		this.#updateObjectDimensions();
	}
		#rescaleObject(new_width, new_height){
			this.scales = {
				x: new_width / this.#texture.width,
				y: new_height / this.#texture.height
			}
			this.object.setScale(this.scales.x, this.scales.y);

		}
		#updateObjectDimensions(){
			this.object.width = this.#texture.width * this.scales.x;
			this.object.height = this.#texture.height * this.scales.y;
		}

	#addPhysics(){
		this.#enablePhysic();
		this.#addGravity();
	}
		#enablePhysic(){
			this.#scene.physics.world.enable(this.object);
		}
		#addGravity(){
			this.object.body.setGravityY(gameConfig.player.gravity_intensity);
		}

	jump(){
		this.object.body.setVelocityY(-gameConfig.player.jump_strength);
	}

	update(velocity_x){
		const velocity_y = this.object.body.velocity.y;
		const angle = Math.atan(velocity_y/velocity_x);
		this.object.rotation = angle;
	}

	resize(new_width, new_height){
		this.#resizeObject(new_width, new_height)
	}
}