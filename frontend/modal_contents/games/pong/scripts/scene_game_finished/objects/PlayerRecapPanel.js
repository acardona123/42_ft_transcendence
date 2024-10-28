class pg_PlayerRecapPanel extends Phaser.GameObjects.Container{
	#scene;
	#player_index_symbol;
	#player_texture;
	#confetti_texture;
	#score;
	#victory_status_symbol;
	#text_style;

	#icon;
	#text_victory_status
	#text_score
	#components_array;

	constructor(
		player_index_symbol,
		player_scene_texture,
		confetti_scene_texture,
		player_score,
		victory_status_symbol,
		text_style = pg_gameConfig.scene_game_finished.text_style
		){
		super(player_scene_texture.scene);

		this.#player_index_symbol = player_index_symbol;
		this.#player_texture = player_scene_texture;
		this.#confetti_texture = confetti_scene_texture;
		this.#score = player_score;
		this.#victory_status_symbol = victory_status_symbol;
		this.#text_style = text_style;

		this.#scene = this.#player_texture.scene;

		this.#addContainerToScene();
		this.#createComponents();
		this.#resizeContainer();
		this.#addComponentsToContainer();
		this.#positionComponents();
	}

		#addContainerToScene(){
			this.#scene.add.existing(this);
		}
		
		#createComponents(){
			this.#createIcon();
			this.#createTextVictoryStatus();
			this.#createTextScore();
			this.#components_array = [this.#icon, this.#text_victory_status, this.#text_score];
		}

			#createIcon(){
				this.#icon = new Icon(this.#player_index_symbol, this.#player_texture, pg_gameConfig.scene_game_finished.panel.icon_size)
			}

			#createTextVictoryStatus(){
				const text_content = this.#createTextVictoryStatusContent();
				this.#text_victory_status = this.#createTextObject(text_content);
			}
				#createTextVictoryStatusContent(){
					if (this.#victory_status_symbol === victory_status.WIN){
						return ("🏆 Winner 🏆")
					} else if (this.#victory_status_symbol === victory_status.TIE) {
						return ("🤝 Tie 🤝")
					} else {
						return ("💀 Looser 💀")
					}
				}

			#createTextScore(){
				const text_content = `Score: ${this.#score}`;
				this.#text_score = this.#createTextObject(text_content);
			}

		#resizeContainer(){
			this.width = Math.max(pg_gameConfig.scene_game_finished.panel.icon_size, this.#text_victory_status.width, this.#text_score.width);
			this.height = pg_gameConfig.scene_game_finished.panel.icon_size + pg_gameConfig.scene_game_finished.panel.icon_bottom_padding
				+ this.#text_victory_status.height + pg_gameConfig.scene_game_finished.panel.line_spacing
				+ this.#text_score.height;
		}

		#addComponentsToContainer(){
			this.add(this.#components_array);
		}

		#positionComponents(){
			this.#setComponentsOrigins();
			this.#setComponentsPosition();
			this.depth = pg_gameConfig.scene_game_finished.depths.panel;
		}
			#setComponentsOrigins(){
				this.#text_victory_status.setOrigin(0.5, 0);
				this.#text_score.setOrigin(0.5, 0);
			}
			#setComponentsPosition(){
				let y = -this.height / 2
				this.#icon.setTopCenterPosition(0, y);
				y += pg_gameConfig.scene_game_finished.panel.icon_size + pg_gameConfig.scene_game_finished.panel.icon_bottom_padding;
				this.#text_victory_status.setPosition(0, y);
				y +=  this.#text_victory_status.height + pg_gameConfig.scene_game_finished.panel.icon_bottom_padding;
				this.#text_score.setPosition(0, y);
			}

		#createTextObject(text_content){
			return (this.#scene.add.text(0, 0, text_content, this.#text_style));
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

	playCelebrationTween(){
		this.#playCelebrationJump();
		this.#playCelebrationConfetti();
	}
		#playCelebrationJump(){
			const initial_icon_y = this.#icon.y;
			this.#scene.tweens.chain({
				targets: this.#icon,
				tweens: [
					{
						y: initial_icon_y - pg_gameConfig.scene_game_finished.panel.celebration.jump_height,
						angle: pg_gameConfig.scene_game_finished.panel.celebration.jump_angle,
						duration: pg_gameConfig.scene_game_finished.panel.celebration.jump_duration,
						ease: 'quad.out'
					},
					{
						y: initial_icon_y,
						angle: 0,
						duration: pg_gameConfig.scene_game_finished.panel.celebration.bounce_duration,
						ease: 'bounce.out'
					},
				],
				loop: -1,
				loopDelay: pg_gameConfig.scene_game_finished.panel.celebration.loop_delay,
			});
		}
		#playCelebrationConfetti(){
			new pg_Confetti(this.#confetti_texture, this.x, this.y);
		}

	playDefeatTween(){
		const initial_icon_y = this.#icon.y;
		
		this.#scene.tweens.chain({
			targets: this.#icon,
			tweens: [
				{
					y: initial_icon_y + pg_gameConfig.scene_game_finished.panel.defeat.kneeing_translation_y,
					angle: pg_gameConfig.scene_game_finished.panel.defeat.kneeing_angle / 2,
					duration: 1000,
					ease: 'Power1',
					repeat: 0,
				},
				{
					angle: {
						from: pg_gameConfig.scene_game_finished.panel.defeat.kneeing_angle / 2,
						to: pg_gameConfig.scene_game_finished.panel.defeat.kneeing_angle
					},
					duration: 2000,
					ease: 'Sine.easeInOut',
					yoyo: true,
					repeat: -1,
				}
			],
			loop: 0
		})
	}
}