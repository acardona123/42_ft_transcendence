
async function start_first_match(match_data){
	close_modal('modal-tournament-round-program', undefined, false);
	open_modal('modal-game', undefined, undefined, false);
	start_tournament_match(match_data);
}

async function jump_to_next_round_or_top1(){  //can throw
	const  go_to_tournament_winner_modal = await was_last_round();  //can throw
	if (go_to_tournament_winner_modal){
		close_modal('modal-tournament-round-program', reset_game, false);
		display_tournament_winner();
	} else {
		init_modal_tournament_round_program();
	}
}

async function tournament_start_round(){
	try {
		first_match_data = await get_tournament_next_round_step_data();
		if (first_match_data.status == 201){
			start_first_match(first_match_data.data);
			return;
		} else if (first_match_data.status == 200){
			create_popup("Warning: this round was only composed of bot's matches, it has been automatically completed. Lets continue", 10000, 4000, HEX_GREEN, HEX_GREEN_HOVER);
			await jump_to_next_round_or_top1();  //can throw
		} else {
			throw Error;
		}
	} catch {
		alert("Sorry but it was impossible to start the round. The tournament has been canceled.");
		close_modal('modal-tournament-round-program', undefined, false);
	}

}