const player_index = Object.freeze({
	PLAYER1: Symbol("left"),
	PLAYER2: Symbol("right"),
});

function areLivesLimited(){
	return (gameMode.maxDeath < 1);
}

function isTimeLimited(){
	return (gameMode.Time <= 0);
}


var game= new Phaser.Game(gameConfig);