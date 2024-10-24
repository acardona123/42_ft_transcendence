async function get_tournament_first_match_data(){
	try {
			let first_match_response = send_tournament_next_match_request();
			if (fetched_data.ok){
				throw new Error("");//TODO
			}
			let data = await first_match_response.json();
			data = data.data;
			//////////TODO: adding the bot level here
			data["bot_level"] = -1;/////////////////
			return (data);

	} catch {
		create_popup("Error while trying to start the round. Tournament canceled", 10000, 4000, HEX_RED, HEX_RED_HOVER);
		//////////////////////////////////TODO=> fatal error going back to main page
	}
}

async function start_first_match(match_data){
	close_modal('modal-tournament-round-program', undefined, false);
	open_modal('modal-game', undefined, undefined, false);

	if (data["game"] === "PG"){
		start_pong_game(match_data, match_data["bot_level"]);
	} else {
		start_flappybird_game(match_data);
	}
}

async function tournament_start_round(){
	first_match_data = await get_tournament_first_match_data();
	if (first_match_data.status == 201){
		start_first_match(first_match_data);
		return;
	} else if (first_match_data.status == 200){
		////////TODO: fatal error going back to main page
		create_popup("Error while trying to start the round. No match in round. Tournament canceled", 10000, 4000, HEX_RED, HEX_RED_HOVER);
	} else {
		create_popup("Error while trying to start the round. Tournament canceled", 10000, 4000, HEX_RED, HEX_RED_HOVER);
		//////////////////////////////////TODO=> fatal error going back to main page
	}

}