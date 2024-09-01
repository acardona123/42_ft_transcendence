const player_index = Object.freeze({
	PLAYER1: Symbol("player1"),
	PLAYER2: Symbol("player2"),
});

function areLivesLimited(){
	return (gameMode.maxDeath > 0);
}

function isTimeLimited(){
	return (gameMode.maxTime > 0);
}


var game= new Phaser.Game(gameConfig);