const player_index = Object.freeze({
	PLAYER1: Symbol("player1"),
	PLAYER2: Symbol("player2"),
});

const victory_status = Object.freeze({
	WIN: Symbol("win"),
	LOOSE: Symbol("loose"),
	TIE: Symbol("tie")
});

function arePointsLimited(){
	return (gameMode.maxPoints > 0);
}

function isTimeLimited(){
	return (gameMode.maxTime > 0);
}

var game= new Phaser.Game(gameConfig);