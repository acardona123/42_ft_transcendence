
class PipePair extends Phaser.GameObjects.Container{
	#scene;
	#pipe_group;
	#spacer_height;
	#pipe_core_height;
	components;
	scales;
	#physical_components
	
	
	constructor(
		scene,
		pipe_group,
		pipe_textures,
		spacer_height = gameConfig.scenePlay.pipe_spacer.height_default,
		offset_to_middle = 0,
		x = gameConfig.width + (Math.max (gameConfig.scenePlay.pipe.core_width, gameConfig.scenePlay.pipe.head_width, gameConfig.scenePlay.pipe_spacer.width))/2
		){
		super(scene);
		this.#scene = scene;
		this.#pipe_group = pipe_group;
		this.depth = gameConfig.scenePlay.depth.pipes;
		this.#generateComponents(pipe_textures);
		this.#runComponentsAnimations(pipe_textures);
		this.#setComponentsOrigin();
		this.#calculateScales(spacer_height);
		this.#resizeComponents();
		this.#positionComponents();
		this.#generateComponentsPhysics();
		this.#integrateComponentsToContainer();
		this.#moveToInitialPosition(offset_to_middle, x);
		this.#scene.add.existing(this);
		this.#scene.physics.world.enable(this);

	}

	#generateComponents(pipe_textures){
		this.components = {};

		this.components.top_pipe_core = pipe_textures.core.createOnScene();
		this.components.top_pipe_head = pipe_textures.head.createOnScene();
		this.components.bottom_pipe_core = pipe_textures.core.createOnScene();
		this.components.bottom_pipe_head = pipe_textures.head.createOnScene();
		this.components.pipe_spacer = pipe_textures.spacer.createOnScene();
	}

	#runComponentsAnimations(pipe_textures){
		pipe_textures.core.playAnimationOn(this.components.top_pipe_core);
		pipe_textures.head.playAnimationOn(this.components.top_pipe_head);
		pipe_textures.core.playAnimationOn(this.components.bottom_pipe_core);
		pipe_textures.head.playAnimationOn(this.components.bottom_pipe_head);
		pipe_textures.spacer.playAnimationOn(this.components.pipe_spacer);
	}

	#setComponentsOrigin(){
		const container_components = [
			this.components.top_pipe_core,
			this.components.top_pipe_head,
			this.components.pipe_spacer,
			this.components.bottom_pipe_head,
			this.components.bottom_pipe_core
		]
		container_components.forEach(component => {
			component.setOrigin(0.5, 0);
		});
	}

	#calculateScales(targeted_spacer_height){
		this.scales = {};
		this.#calculateScaleCore();
		this.#calculateScaleHead();
		this.#calculateScaleSpacer(targeted_spacer_height);
	}
		#calculateScaleCore(){
			const flyable_zone_height = gameConfig.height - gameConfig.scenePlay.ground.height - gameConfig.scenePlay.ceiling.height;
			this.#pipe_core_height = flyable_zone_height - gameConfig.scenePlay.pipe_spacer.height_min - 2 * gameConfig.scenePlay.pipe.head_height;
			this.scales.core = {
				x: gameConfig.scenePlay.pipe.core_width / gameTextures.pipe.core.width,
				y: this.#pipe_core_height / gameTextures.pipe.core.height
			};
		}
		#calculateScaleHead(){
			this.scales.head = {
				x: gameConfig.scenePlay.pipe.head_width / gameTextures.pipe.head.width,
				y: gameConfig.scenePlay.pipe.head_height / gameTextures.pipe.head.height
			}
		}
		#calculateScaleSpacer(targeted_spacer_height){
			this.#spacer_height = clamp(targeted_spacer_height, gameConfig.scenePlay.pipe_spacer.height_min, gameConfig.scenePlay.pipe_spacer.height_max);
			this.scales.spacer = {
				x: gameConfig.scenePlay.pipe_spacer.width / gameTextures.pipe_spacer.width,
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
			core.width = gameTextures.pipe.core.width * this.scales.core.x;
			core.height = gameTextures.pipe.core.height * this.scales.core.y;
		}
		#resizePipeHead(head){
			head.setScale(this.scales.head.x, this.scales.head.y);
			head.width = gameTextures.pipe.head.width * this.scales.head.x;
			head.height = gameTextures.pipe.head.height * this.scales.head.y;
		}
		#resizeSpacer(){
			this.components.pipe_spacer.setScale(this.scales.spacer.x, this.scales.spacer.y);
			this.components.pipe_spacer.width = gameTextures.pipe_spacer.width * this.scales.spacer.x;
			this.components.pipe_spacer.height = gameTextures.pipe_spacer.height * this.scales.spacer.y;
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
			container_components[0];
			container_components[0].y = - (this.#pipe_core_height + gameConfig.scenePlay.pipe.head_height + this.#spacer_height / 2);
		}
		#verticallyAlignComponent(container_components){
			Phaser.Actions.AlignTo(container_components, Phaser.Display.Align.BOTTOM_CENTER);
		}

	#generateComponentsPhysics(){
		this.#physical_components = [
			this.components.top_pipe_core,
			this.components.top_pipe_head,
			this.components.bottom_pipe_head,
			this.components.bottom_pipe_core
		]
		this.#addComponentsToPipeGroup();
		this.#makeBodiesImmovable();
	}
		#enableBodies(){
			this.#physical_components.forEach(component => {
				this.#scene.physics.world.enable(component);
			});
		}
		#makeBodiesImmovable(){
			this.#physical_components.forEach(component => {
				component.body.setImmovable(true);
			})
		}
		#addComponentsToPipeGroup(){
			this.#physical_components.forEach(component => {
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
			this.#fitContainerToComponentsWidth();
			this.#fitContainerToComponentsHeight();
		}
			#fitContainerToComponentsWidth(){
				const container_width = Math.max (gameConfig.scenePlay.pipe.core_width, gameConfig.scenePlay.pipe.head_width, gameConfig.scenePlay.pipe_spacer.width);
				const container_height = this.height;
				this.setSize(container_width, container_height);
			}
			#fitContainerToComponentsHeight(){
				const container_width = this.width;
				const container_height = 2 * (this.#pipe_core_height + gameConfig.scenePlay.pipe.head_height) + this.#spacer_height;
				this.setSize(container_width, container_height);
			}

	disable(){
		this.#hideComponents();
		this.#disableComponentsPhysic();
	}
		#hideComponents(){
			this.setVisible(false);
		}
		#disableComponentsPhysic(){
			this.#physical_components.forEach(component => {
				this.#scene.physics.world.disable(component);
			});
		}

	reactivate(targeted_spacer_height = gameConfig.scenePlay.pipe_spacer.height_default, offset_to_middle = 0, x = gameConfig.width + this.width/2){
		this.#resetSpacerSize(targeted_spacer_height);
		this.#enableBodies();
		this.#moveToInitialPosition(offset_to_middle, x);
		this.#showComponents();
	}
		#resetSpacerSize(targeted_spacer_height){
			if (targeted_spacer_height != this.#spacer_height){
				this.#calculateScaleSpacer(targeted_spacer_height);
				this.#resizeSpacer();
				this.#positionComponents();
			}
		}

		#moveToInitialPosition(offset_to_middle = 0, x = gameConfig.width + this.width/2){
			this.x = x - this.width/2;
			this.setVerticalOffset(offset_to_middle);
		}
		#showComponents(){
			this.setVisible(true);
		}

	setVerticalOffset(offset_to_middle){
		offset_to_middle = clamp(offset_to_middle, -gameConfig.scenePlay.pipe_repartition.vertical_offset_max, gameConfig.scenePlay.pipe_repartition.vertical_offset_max);
		this.y = flyable_zone_center_y + offset_to_middle;
	}
}