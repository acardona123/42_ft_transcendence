const text_alignment = Object.freeze({
    ALIGN_LEFT:   Symbol("align_left"),
    ALIGN_RIGHT:  Symbol("align_right"),
});

class AlignedText extends Phaser.GameObjects.Text{
	constructor(scene, alignment, x, y, text_content, style){
		if (alignment != text_alignment.ALIGN_LEFT && alignment != text_alignment.ALIGN_RIGHT){
			throw new Error("Wrong text alignment for the scores")
		}
		if (alignment === text_alignment.ALIGN_LEFT){
			super(scene, x, y, text_content, style).setOrigin(0, 0.5);
		} else{
			super(scene, x, y, text_content, style).setOrigin(1, 0.5);
		}
	}
}
