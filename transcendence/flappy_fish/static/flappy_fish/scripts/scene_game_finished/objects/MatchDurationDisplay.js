class MatchDurationDisplay extends Phaser.GameObjects.Container{
	#scene;

	#title;
	#duration_text;
	#components_array;


	constructor (scene, match_duration, x = 0, y = 0){
		super (scene, x, y);
		this.#scene = scene;
		this.#addContainerToScene();
		this.#createComponents(match_duration);
		this.#resizeContainerToFit();
		this.#addComponentsToContainer();
		this.#positionComponents();
	}

	#addContainerToScene(){
		this.#scene.add.existing(this);
	}

	#createComponents(match_duration){
		this.#createTitle();
		this.#createDurationText(match_duration);
		this.#components_array = [this.#title, this.#duration_text];
	}
		#createTitle(){
			const title_text = "Match duration: "
			this.#title =  this.#scene.add.text(0, 0, title_text, gameConfig.scene_game_finished.text_style);
		}
		#createDurationText(match_duration){
			this.#duration_text = new TimeDisplay(this.#scene, 0, 0, gameConfig.scene_game_finished.text_style, match_duration);
		}

	#resizeContainerToFit(){
		this.width = this.#title.width + this.#duration_text.width;
		this.height = Math.max(this.#title.height, this.#duration_text.height)
	}

	#addComponentsToContainer(){
		this.add(this.#components_array);
	}

	#positionComponents(){
		this.#setComponentsOrigins();
		this.#setComponentsPosition();
		this.depth = gameConfig.scene_game_finished.depth.game_duration;
	}
		#setComponentsOrigins(){
			this.#title.setOrigin(0, 0.5);
			this.#duration_text.setOrigin(0, 0.5);
		}
		#setComponentsPosition(){
			let x = -this.width / 2
			this.#title.setPosition(x, 0);
			x += this.#title.width;
			this.#duration_text.setPosition(x, 0);
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
}