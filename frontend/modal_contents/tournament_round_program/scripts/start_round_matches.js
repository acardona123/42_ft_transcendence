
async function start_first_match(match_data){
	close_modal('modal-tournament-round-program', undefined, undefined, false);
	open_modal('modal-game', undefined, undefined, false);
	start_tournament_match(match_data);
}

async function tournament_start_round(){
	first_match_data = await get_tournament_next_round_step_data();
	if (first_match_data.status == 201){
		start_first_match(first_match_data.data);
		return;
	} else if (first_match_data.status == 200){
		////////TODO: fatal error going back to main page
		create_popup("Error while trying to start the round. No match in round. Tournament canceled", 10000, 4000, HEX_RED, HEX_RED_HOVER);
	} else {
		create_popup("Error while trying to start the round. Tournament canceled", 10000, 4000, HEX_RED, HEX_RED_HOVER);
		//////////////////////////////////TODO=> fatal error going back to main page
	}

}