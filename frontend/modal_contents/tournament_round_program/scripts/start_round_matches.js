
async function start_first_match(match_data){
	close_modal('modal-tournament-round-program', undefined, undefined, false);
	open_modal('modal-game', undefined, undefined, false);
	start_tournament_match(match_data);
}

async function jump_to_next_round(){
	init_modal_tournament_round_program();
}

async function tournament_start_round(){
	first_match_data = await get_tournament_next_round_step_data();
	if (first_match_data.status == 201){
		start_first_match(first_match_data.data);
		return;
	} else if (first_match_data.status == 200){
		////////TODO: signalling the jump to ne next round
		create_popup("Warning: this round was only composed of bot's matches, here is the next round", 10000, 4000, HEX_GREEN, HEX_GREEN_HOVER);
		jump_to_next_round();
	} else {
		create_popup("Error while trying to start the round. Tournament canceled", 10000, 4000, HEX_RED, HEX_RED_HOVER);
		//////////////////////////////////TODO=> fatal error going back to main page
	}

}