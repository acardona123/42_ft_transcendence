class EntitledTimeDisplay extends Phaser.GameObjects.Container{
	#scene;

	#title;
	#time_text;
	#components_array;


	constructor (scene, title_text, time, style, depth, x = 0, y = 0){
		super (scene, x, y);
		this.#scene = scene;
		this.depth = depth;
		this.#addContainerToScene();
		this.#createComponents(title_text, time, style);
		this.#resizeContainerToFit();
		this.#addComponentsToContainer();
		this.#positionComponents();
	}

	#addContainerToScene(){
		this.#scene.add.existing(this);
	}

	#createComponents(title_text, time, style){
		this.#createTitle(title_text, style);
		this.#createTimeText(time, style);
		this.#components_array = [this.#title, this.#time_text];
	}
		#createTitle(title_text, style){
			const title_text_content = `${title_text}: `;
			this.#title =  this.#scene.add.text(0, 0, title_text_content, style);
		}
		#createTimeText(time, style){
			if (time < 0){
				this.#time_text = this.#scene.add.text(0,0, "∞", style);
			} else {
				this.#time_text = new TimeDisplay(this.#scene, 0, 0, style, time);
			}
		}

	#resizeContainerToFit(){
		this.width = this.#title.width + this.#time_text.width;
		this.height = Math.max(this.#title.height, this.#time_text.height)
	}

	#addComponentsToContainer(){
		this.add(this.#components_array);
	}

	#positionComponents(){
		this.#setComponentsOrigins();
		this.#setComponentsPosition();;
	}
		#setComponentsOrigins(){
			this.#title.setOrigin(0, 0.5);
			this.#time_text.setOrigin(0, 0.5);
		}
		#setComponentsPosition(){
			let x = -this.width / 2
			this.#title.setPosition(x, 0);
			x += this.#title.width;
			this.#time_text.setPosition(x, 0);
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