class Player{
	#scene_texture;
	#group;
	#index;
	object;
	scale;

	constructor(player_group, player_index_symbol, scene_texture){
		this.#group = player_group;
		this.#scene_texture = scene_texture;
		this.#index = player_index_symbol;
		this.#createObject();
		this.#resizeObject(gameConfig.player.width, gameConfig.player.height);
		player_group.add(this.object);
		this.#addPhysics();
	}

	#createObject(){
		const init_x = gameConfig.player.position_x;
		const init_y = flyable_zone_center_y;
		const addToPhysics = true;
		this.object = this.#scene_texture.createOnScene(init_x, init_y, addToPhysics),
		this.object.depth = gameConfig.depth.players;
		this.object.setAlpha(gameConfig.player.alpha);
		this.object.index = this.#index;

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
		this.#addBorderCollision();
	}
		#enablePhysic(){
			this.#scene_texture.scene.physics.world.enable(this.object);
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

	activateGravity(boolean){
		if (boolean === true){
			this.object.setGravityY(gameConfig.player.gravity_intensity);
		} else {
			this.object.setGravityY(0);
		}
	}
}