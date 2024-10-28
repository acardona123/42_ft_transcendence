function arePointsLimited(){
	try{
		return (gameMode.maxPoints > 0);
	} catch {
		return (false);
	}
}

function isTimeLimited(){
	return (gameMode.maxTime > 0);
}