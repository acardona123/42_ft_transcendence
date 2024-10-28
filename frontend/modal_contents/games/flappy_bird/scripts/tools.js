function areLivesLimited(){
	try{
		return (fb_gameMode.maxDeath > 0);
	} catch {
		return (false);
	}
}

function fb_isTimeLimited(){
	return (fb_gameMode.maxTime > 0);
}

function clamp(number, min, max){
	return (Math.min(max, Math.max(number, min)));
}