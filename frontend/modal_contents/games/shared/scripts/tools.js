const player_index = Object.freeze({
	PLAYER1: Symbol("player1"),
	PLAYER2: Symbol("player2"),
});

const victory_status = Object.freeze({
	WIN: Symbol("win"),
	LOOSE: Symbol("loose"),
	TIE: Symbol("tie")
});

const text_alignment = Object.freeze({
	ALIGN_LEFT:   Symbol("align_left"),
	ALIGN_RIGHT:  Symbol("align_right"),
});

let custom_event = undefined;
function init_custom_event(){
	custom_event = new Phaser.Events.EventEmitter();
}
const event_stop_game = "stop_game"

function clamp(number, min, max){
	return (Math.min(max, Math.max(number, min)));
}