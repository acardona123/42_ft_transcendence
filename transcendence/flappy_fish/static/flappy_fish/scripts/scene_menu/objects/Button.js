class Button extends Phaser.GameObjects.Container{
	#scene
	#button_text_content
	#button_style;

	#background_shape;
	#text;
	#components_array;

	constructor(scene, button_text, button_style){
		super (scene);
		this.#scene = scene;
		this.#button_text_content = button_text;
		this.#button_style = button_style;

		this.#addContainerToScene();
		this.#createComponents();
		this.#resizeContainerToFit();
		this.#addComponentsToContainer();
		this.#positionComponents();
		this.#setInteraction();
	}

	#addContainerToScene(){
		this.#scene.add.existing(this);
	}

	#createComponents(){
		this.#createContentText();
		this.#createBackgroundShape();
		this.#components_array = [this.#background_shape, this.#text];
	}
		#createContentText(){
			this.#text = this.#scene.add.text(0, 0, this.#button_text_content, this.#button_style.text)
		}

		#createBackgroundShape(){
			const style = this.#button_style.shape;
			const width = this.#text.width + 2 * this.#button_style.margin;
			const height = this.#text.height;
			const radius = Math.min (width, height) / 2;

			this.#background_shape = this.#scene.add.graphics();
			if (this.#button_style.shape.line_width > 0){
				this.#createBackgroundShapeOuterLines(style, width, height, radius);
			}
			this.#createBackgroundShapeFilling(style, width, height, radius);
		}
			#createBackgroundShapeOuterLines(style, width, height, radius){
				this.#background_shape.lineStyle(style.line_width, style.color, style.line_alpha);
				this.#background_shape.strokeRoundedRect(0, 0, width, height, radius);
			}
			#createBackgroundShapeFilling(style, width, height, radius){
				this.#background_shape.fillStyle(style.fill_color, style.fill_alpha)
				this.#background_shape.fillRoundedRect(0, 0, width, height, radius);
			}
	
	#resizeContainerToFit(){
		this.width = this.#text.width + 2 * this.#button_style.margin;
		this.height = this.#text.height;
	}

	#addComponentsToContainer(){
		this.add(this.#components_array);
	}

	#positionComponents(){
		this.#text.setOrigin(0.5);
		this.#text.setPosition(0);
		this.#background_shape.setPosition(-this.width / 2, - this.height / 2);
		this.depth = gameConfig.scene_game_finished.depth.game_time;
	}

	#setInteraction(){
		this.setInteractive();
	}
	
	setTopCenterPosition(x, y){
		this.setPosition(x, y + this.height / 2);
	}
	
	setTopLeftCornerPosition(x, y){
		this.setPosition(x + this.width / 2, y + this.height / 2);
	}
	
	setTopRightCornerPosition(x, y){
		this.setPosition(x - this.width / 2, y + this.height / 2);
	}

	setBottomCenterPosition(x, y){
		this.setPosition(x, y - this.height / 2);
	}
	
	setBottomLeftCornerPosition(x, y){
		this.setPosition(x + this.width / 2, y - this.height / 2);
	}
	
	setBottomRightCornerPosition(x, y){
		this.setPosition(x - this.width / 2, y - this.height / 2);
	}
}