
class PipePair extends Phaser.GameObjects.Container{
	#scene;
	#pipe_group;
	#spacer_height;
	#pipe_core_height;
	components;
	scales;
	
	
	constructor(scene, pipe_group, core_texture_name, head_texture_name, spacer_texture_name, spacer_height = gameConfig.pipe_spacer.height_default){
		super(scene);
		this.#scene = scene;
		this.#pipe_group = pipe_group;
		this.#generateComponents(core_texture_name, head_texture_name, spacer_texture_name);
		this.#calculateScales(spacer_height);
		this.#resizeComponents();
		this.#positionComponents();
		this.#generateComponentsPhysics();
		this.#integrateComponentsToContainer();
		this.#scene.add.existing(this);
		this.#scene.physics.world.enable(this);
	}

	#generateComponents(core_texture_name, head_texture_name, spacer_texture_name){
		this.components = {};

		this.components.top_pipe_core = this.#scene.add.sprite(0, 0, core_texture_name);
		this.components.top_pipe_head = this.#scene.add.sprite(0, 0, head_texture_name);
		this.components.bottom_pipe_core =  this.#scene.add.sprite(0, 0, core_texture_name);
		this.components.bottom_pipe_head = this.#scene.add.sprite(0, 0, head_texture_name);
		this.components.pipe_spacer = this.#scene.add.sprite(0, 0, spacer_texture_name);
	}

	#calculateScales(targeted_spacer_height){
		this.#spacer_height = clamp(targeted_spacer_height, gameConfig.pipe_spacer.height_min, gameConfig.pipe_spacer.height_max);
		this.#pipe_core_height = gameConfig.height - this.#spacer_height - 2 * gameConfig.pipe.head_height;

		this.scales = {};
		this.scales.core = {
			x: gameConfig.pipe.core_width / gameTextures.pipe.core.width,
			y: this.#pipe_core_height / gameTextures.pipe.core.height
		};
		this.scales.head = {
			x: gameConfig.pipe.head_width / gameTextures.pipe.head.width,
			y: gameConfig.pipe.head_height / gameTextures.pipe.head.height
		}
		this.scales.spacer = {
			x: gameConfig.pipe_spacer.width / gameTextures.pipe_spacer.width,
			y: this.#spacer_height / gameTextures.pipe_spacer.height
		}
	}

	#resizeComponents(){
		this.#resizePipeCore(this.components.top_pipe_core);
		this.#resizePipeCore(this.components.bottom_pipe_core);
		this.#resizePipeHead(this.components.top_pipe_head);
		this.#resizePipeHead(this.components.bottom_pipe_head);
		this.#resizeSpacer();
	}
		#resizePipeCore(core){
			core.setScale(this.scales.core.x, this.scales.core.y);
			core.width *= this.scales.core.x;
			core.height *= this.scales.core.y;
		}
		#resizePipeHead(head){
			head.setScale(this.scales.head.x, this.scales.head.y);
			head.width *= this.scales.head.x;
			head.height *= this.scales.head.y;
		}
		#resizeSpacer(){
			this.components.pipe_spacer.setScale(this.scales.spacer.x, this.scales.spacer.y);
			this.components.pipe_spacer.width *= this.scales.spacer.x;
			this.components.pipe_spacer.height *= this.scales.spacer.y;
		}

	#positionComponents(){
		const container_components = [
			this.components.top_pipe_core,
			this.components.top_pipe_head,
			this.components.pipe_spacer,
			this.components.bottom_pipe_head,
			this.components.bottom_pipe_core
		]
		this.#positionFirstComponent(container_components);
		this.#verticallyAlignComponent(container_components);
	}
		#positionFirstComponent(container_components){
			container_components[0].setOrigin(0.5, 0);
			container_components[0].y = - (this.#pipe_core_height + gameConfig.pipe.head_height + this.#spacer_height / 2);
		}
		#verticallyAlignComponent(container_components){
			Phaser.Actions.AlignTo(container_components, Phaser.Display.Align.BOTTOM_CENTER);
		}

	#generateComponentsPhysics(){
		const solid_pipes = [
			this.components.top_pipe_core,
			this.components.top_pipe_head,
			this.components.bottom_pipe_head,
			this.components.bottom_pipe_core
		]
		this.#enableBodies(solid_pipes);
		this.#addComponentsToPipeGroup(solid_pipes);
	}
		#enableBodies(solid_pipes){
			solid_pipes.forEach(component => {
				this.#scene.physics.world.enable(component);
			});
		}
		#addComponentsToPipeGroup(solid_pipes){
			solid_pipes.forEach(component => {
				this.#pipe_group.add(component);
			});
		}

	#integrateComponentsToContainer(){
		this.#addComponentsToContainer();
		this.#fitContainerToComponents();
	}
		#addComponentsToContainer(){
			Object.values(this.components).forEach(value => {
				this.add(value);
			});
		}
		#fitContainerToComponents(){
			const container_width = Math.max (gameConfig.pipe.core_width, gameConfig.pipe.head_width, gameConfig.pipe_spacer.width);
			const container_height = 2 * (this.#pipe_core_height + gameConfig.pipe.head_height) + this.#spacer_height;
			this.setSize(container_width, container_height);
		}

	setVerticalOffset(offset_to_middle){
		offset_to_middle = clamp(offset_to_middle, -gameConfig.pipe_spacer.vertical_offset_max, gameConfig.pipe_spacer.vertical_offset_max);
		this.y = offset_to_middle + gameConfig.height / 2;
	}

}