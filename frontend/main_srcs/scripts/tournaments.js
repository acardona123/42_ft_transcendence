let tournament_id = undefined;

async function send_tournament_next_match_request(){
	const url = "https://localhost:8443/api/tournaments/match/start/";
	const body_content = {"tournament_id": tournament_id};
	let fetched_data = await fetch_with_token(url, {
		method: 'POST',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify(body_content)
	});
	return (fetched_data);
}	

async function get_tournament_next_round_step_data(){
	try {
			let next_step = {};
			
			let next_step_response = await send_tournament_next_match_request();
			if (next_step_response.status != 200 && next_step_response.status != 201){
				throw new Error("");//TODO
			}
			next_step.status = next_step_response.status;
			let body = await next_step_response.json();
			next_step.data = body.data[0];
			return (next_step);

	} catch {
		create_popup("FATAL ERROR while trying to start the round. Tournament canceled", 10000, 4000, HEX_RED, HEX_RED_HOVER);
			console.log("error")//
		//////////////////////////////////TODO=> fatal error going back to main page
	}

}


function display_tournament_guests(){

}

function display_tournament_round_program(){
	open_modal("modal-tournament-round-program", undefined, init_modal_tournament_round_program, false);
}

function display_tournament_winner(){
	//TODO openning the tournament top 1 modal here 
		create_popup("tournament end, wiiiiiiiiiiin", 10000, 4000, HEX_GREEN, HEX_GREEN);
}

async function tournament_end_round_redirection(){
	const go_to_tournament_winner_modal = await was_last_round();
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

async function continue_tournament_round(){
	const next_step = await get_tournament_next_round_step_data();
	if (next_step.status == 200){
		await tournament_end_round_redirection();
	} else {
		const next_match_data = next_step.data;
		start_tournament_match(next_match_data);
	}
}
