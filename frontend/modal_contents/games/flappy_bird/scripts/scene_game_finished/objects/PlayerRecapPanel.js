class fb_PlayerRecapPanel extends Phaser.GameObjects.Container{
	#scene;
	#player_index_symbol;
	#player_texture;
	#confetti_texture;
	#score;
	#victory_status_symbol;
	#flip_icon;
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
		flip_icon = false,
		text_style = fb_gameConfig.scene_game_finished.text_style
		){
		super(player_scene_texture.scene);

		this.#player_index_symbol = player_index_symbol;
		this.#player_texture = player_scene_texture;
		this.#confetti_texture = confetti_scene_texture;
		this.#score = player_score;
		this.#victory_status_symbol = victory_status_symbol;
		this.#flip_icon = flip_icon;
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
				this.#createIconObject();
				this.#resizeIconObject();
				this.#playIconAnimation();
			}
				#createIconObject(){
					this.#icon = this.#player_texture.createOnScene(200,200);
					this.#icon.flipX = this.#flip_icon;
				}
				#resizeIconObject(){
					const scale_x = this.#player_texture.getScaleToTargetWidth(fb_gameConfig.scene_game_finished.panel.icon_size);
					const scale_y = this.#player_texture.getScaleToTargetHeight(fb_gameConfig.scene_game_finished.panel.icon_size);
					const scale = Math.min(scale_x, scale_y);
					this.#icon.setScale(scale);
				}
				#playIconAnimation(){
					this.#player_texture.playAnimationOn(this.#icon);
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
				const text_content = this.#createTextScoreContent();
				this.#text_score = this.#createTextObject(text_content);
			}
				#createTextScoreContent(){
					if (areLivesLimited()){
						return (`Lives: ${this.#score} / ${fb_gameMode.maxDeath}`)
					} else {
						return (`Deaths: ${this.#score}`)
					}
				}

		#resizeContainer(){
			this.width = Math.max(fb_gameConfig.scene_game_finished.panel.icon_size, this.#text_victory_status.width, this.#text_score.width);
			this.height = fb_gameConfig.scene_game_finished.panel.icon_size + fb_gameConfig.scene_game_finished.panel.icon_bottom_padding
				+ this.#text_victory_status.height + fb_gameConfig.scene_game_finished.panel.line_spacing
				+ this.#text_score.height;
		}

		#addComponentsToContainer(){
			this.add(this.#components_array);
		}

		#positionComponents(){
			this.#setComponentsOrigins();
			this.#setComponentsPosition();
			this.depth = fb_gameConfig.scene_game_finished.depth.panel;
		}
			#setComponentsOrigins(){
				this.#icon.setOrigin(0.5, 0);
				this.#text_victory_status.setOrigin(0.5, 0);
				this.#text_score.setOrigin(0.5, 0);
			}
			#setComponentsPosition(){
				let y = -this.height / 2
				this.#icon.setPosition(0, y);
				y += fb_gameConfig.scene_game_finished.panel.icon_size + fb_gameConfig.scene_game_finished.panel.icon_bottom_padding;
				this.#text_victory_status.setPosition(0, y);
				y +=  this.#text_victory_status.height + fb_gameConfig.scene_game_finished.panel.icon_bottom_padding;
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
						y: initial_icon_y - fb_gameConfig.scene_game_finished.panel.celebration.jump_height,
						angle: fb_gameConfig.scene_game_finished.panel.celebration.jump_angle * (this.#flip_icon ? 1 : -1),
						duration: fb_gameConfig.scene_game_finished.panel.celebration.jump_duration,
						ease: 'quad.out'
					},
					{
						y: initial_icon_y,
						angle: 0,
						duration: fb_gameConfig.scene_game_finished.panel.celebration.bounce_duration,
						ease: 'bounce.out'
					},
				],
				loop: -1,
				loopDelay: fb_gameConfig.scene_game_finished.panel.celebration.loop_delay,
			});
		}
		#playCelebrationConfetti(){
			new fb_Confetti(this.#confetti_texture, this.x, this.y);
		}

	playDefeatTween(){
		const initial_icon_y = this.#icon.y;
		
		this.#scene.tweens.chain({
			targets: this.#icon,
			tweens: [
				{
					y: initial_icon_y + fb_gameConfig.scene_game_finished.panel.defeat.kneeing_translation_y,
					angle: fb_gameConfig.scene_game_finished.panel.defeat.kneeing_angle / 2 * (this.#flip_icon ? -1 : 1),
					duration: 1000,
					ease: 'Power1',
					repeat: 0,
				},
				{
					angle: {
						from: fb_gameConfig.scene_game_finished.panel.defeat.kneeing_angle / 2 * (this.#flip_icon ? -1 : 1),
						to: fb_gameConfig.scene_game_finished.panel.defeat.kneeing_angle * (this.#flip_icon ? -1 : 1)
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