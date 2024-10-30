
async function start_first_match(match_data){
	close_modal('modal-tournament-round-program', undefined, undefined, false);
	open_modal('modal-game', undefined, undefined, false);
	start_tournament_match(match_data);
}

async function jump_to_next_round(){
	init_modal_tournament_round_program();
}

async function tournament_start_round(){
	try {
		first_match_data = await get_tournament_next_round_step_data();
		if (first_match_data.status == 201){
			start_first_match(first_match_data.data);
			return;
		} else if (first_match_data.status == 200){
			create_popup("Warning: this round was only composed of bot's matches, here is the next round", 10000, 4000, HEX_GREEN, HEX_GREEN_HOVER);
			jump_to_next_round();
		} else {
			throw Error;
		}
	} catch {
		alert("Sorry but it was impossible to start the round. The tournament has been canceled.");
		close_modal('modal-tournament-round-program', undefined, undefined, false);
	}

}