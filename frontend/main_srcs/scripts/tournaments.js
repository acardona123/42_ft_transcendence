let tournament_id = undefined;


async function send_tournament_next_match_request(){ //can throw
	const url = "/api/tournaments/match/start/";
	const body_content = {"tournament_id": tournament_id};
	let fetched_data = await fetch_with_token(url, {
		method: 'POST',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify(body_content)
	});
	return (fetched_data);
}	

async function get_tournament_next_round_step_data(){ //can throw
	
	let next_step_response = await send_tournament_next_match_request(); //can throw
	if (next_step_response.status != 200 && next_step_response.status != 201){
		throw Error;
	}
	let next_step = {};
	next_step.status = next_step_response.status;
	let body = await next_step_response.json();
	next_step.data = body.data[0];
	return (next_step);
}

function display_tournament_round_program(){
	open_modal("modal-tournament-round-program", undefined, init_modal_tournament_round_program, false);
}

function display_tournament_winner(){
	open_modal("modal-tournament-top1", undefined, init_modal_tournament_top1, false);
}

async function tournament_end_round_redirection(){
	let go_to_tournament_winner_modal;
	try {
		go_to_tournament_winner_modal = await was_last_round();  //can throw
	} catch {
		close_modal('modal-game', reset_game, false);
		alert("Sorry but it was impossible to continue the round. The tournament has been canceled.");
	}
	close_modal('modal-game', reset_game, false);
	if (go_to_tournament_winner_modal) {
		display_tournament_winner();
	} else {
		display_tournament_round_program();
	}
}

async function start_tournament_match(match_data){
	if (match_data["game"] === "PG"){
		const bot_level = match_data["bot_level"];
		await start_pong_game(match_data, bot_level);
	} else {
		await start_flappybird_game(match_data);
	}
}

async function continue_tournament_round(){ //can throw
	const next_step = await get_tournament_next_round_step_data(); //can throw
	if (next_step.status == 200){
		await tournament_end_round_redirection();
	} else {
		const next_match_data = next_step.data;
		start_tournament_match(next_match_data);
	}
}
