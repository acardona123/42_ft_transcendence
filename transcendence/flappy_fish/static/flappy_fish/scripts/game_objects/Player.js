class Player{
	#scene_texture;
	object;
	scale;

	constructor(scene_texture){
		this.#scene_texture = scene_texture;
		this.#createObject();
		this.#resizeObject(gameConfig.player.width, gameConfig.player.height);
		this.#addPhysics();
	}

	#createObject(){
		const init_x = gameConfig.player.position_x;
		const init_y = (gameConfig.height - gameConfig.ground.height) / 2;
		const addToPhysics = true;
		this.object = this.#scene_texture.createOnScene(init_x, init_y, addToPhysics),
		this.object.depth = gameConfig.depth.players;
		this.object.setAlpha(gameConfig.player.alpha);
	}

	#resizeObject(new_width, new_height){
		this.#rescaleObject(new_width, new_height);
		this.#updateObjectDimensions();
	}
		#rescaleObject(new_width, new_height){
			this.scales = {
				x: new_width / this.#scene_texture.texture.width,
				y: new_height / this.#scene_texture.texture.height
			}
			this.object.setScale(this.scales.x, this.scales.y);

		}
		#updateObjectDimensions(){
			this.object.width = this.#scene_texture.texture.width * this.scales.x;
			this.object.height = this.#scene_texture.texture.height * this.scales.y;
		}

	#addPhysics(){
		this.#enablePhysic();
		this.#addGravity();
		this.#addBorderCollision();
	}
		#enablePhysic(){
			this.#scene_texture.scene.physics.world.enable(this.object);
		}
		#addGravity(){
			this.object.setGravityY(gameConfig.player.gravity_intensity);
		}
		#addBorderCollision(){
			this.object.setCollideWorldBounds(true, 0, 0);
		}

	jump(){
		this.object.setVelocityY(-gameConfig.player.jump_strength);
	}

	update(velocity_x){
		const velocity_y = this.object.body.velocity.y;
		const angle = Math.max(Math.atan(velocity_y/velocity_x), -0.17); 
		this.object.rotation = angle;
	}

	resize(new_width, new_height){
		this.#resizeObject(new_width, new_height)
	}
}