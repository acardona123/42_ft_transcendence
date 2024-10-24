const tournament_modal_id = "modal-tournament-round-program"
const tournament_match_list_id = "trp-round-matches-list"
const tournament_waiting_player_id = "trp-waiting-player-desctiption"


async function get_round_matches_from_DB(tournament_id)
{
	const url = `https://localhost:8443/api/tournaments/round/?tournament_id=${tournament_id}`;

	try
	{
		let data_fetched = await fetch_with_token(url, {
			method: 'GET',
			headers: {}
		});
		let data = await data_fetched.json();
		if (!data_fetched.ok)
			throw new Error(`${data.get("message", "internal error")}`);
		return data.matches;
	}
	catch (error)
	{
		create_popup(`Retrieving round matches failed: ${error.message}`,
			2000, 4000,
			hex_color=HEX_RED, t_hover_color=HEX_RED_HOVER);
		//==============================================================================
		// retour a la page d'accueil ?
		//==============================================================================
	}
	return undefined;

}

async function dummy_get_round_matches_from_DB (tournament_id){
	if (tournament_id == 0){ //one waiting player
		return [["player0123456789","player0123456789"],["player3","player4"],["player3","player4"],["player3","player4"],["player3","player4"],["player3","player4"],["player3","player4"],["player3","player4"],["player3","player4"],["player3","player4"],["player3","player4"],["player5"]];
	} else {//no player wainting during the round
		return [["player1","player2"],["player3","player4"]];
	}
}



let new_matches_list = [];
let new_waiting_player_elem = undefined;
let new_round_number_elem = undefined;

function add_match_to_updated_list(match){

	let new_match_div = document.createElement('div');
	new_match_div.className = "trp-match-elem"

	const span_left = document.createElement('span');
	span_left.className = "trp-match-player1";
	span_left.textContent = match[0];
	new_match_div.appendChild(span_left);

	const mid_text = document.createElement('p');
	mid_text.textContent = " vs ";
	mid_text.className = "trp-match-mid";
	new_match_div.appendChild(mid_text);

	const span_right = document.createElement('span');
	span_right.className = "trp-match-player2";
	span_right.textContent = match[1];
	new_match_div.appendChild(span_right);

	new_matches_list.push(new_match_div);
}

function get_waiting_player_description(match){
	const waiting_player_description = document.createElement('p');
	waiting_player_description.textContent = `Lucky you ${match[0]}, you have been automatically promoted to the next round ! During this one get some corn and enjoy the chaos amoung the other players...`;
	return waiting_player_description;
}

function add_a_waiting_player(match){
	let new_waiting_player = document.createElement('div');
	new_waiting_player.className = "trp-waiting-player-elem"
	const waiting_player_description = get_waiting_player_description(match);
	new_waiting_player.appendChild(waiting_player_description);
	new_waiting_player_elem = new_waiting_player;
}

function get_no_waiting_player_description(){
	const waiting_player_description = document.createElement('p');
	waiting_player_description.textContent = "This round is a busy one, everybody has to play in a match. Lets fight !";
	return waiting_player_description;
}
function generate_no_waiting_player_elem(){
	let new_waiting_player = document.createElement('div');
	new_waiting_player.className = "trp-no-waiting-player-elem"
	const no_waiting_player_description = get_no_waiting_player_description();
	new_waiting_player.appendChild(no_waiting_player_description);
	return new_waiting_player;
}

async function regenerate_matches_elements(tournament_id){
	new_matches_list = [];
	new_waiting_player_elem = generate_no_waiting_player_elem();

	const matches_data = await dummy_get_round_matches_from_DB(tournament_id);

	matches_data.forEach(match => {
		if (match.length == 2){
			add_match_to_updated_list(match);
		} else {
			add_a_waiting_player(match);
		}
	});

}

function update_round_matches_content(){
	const round_matches_elem = document.getElementById(tournament_match_list_id);
	new_matches_list.forEach(match => {
		round_matches_elem.appendChild(match)
	});
}

function update_waiting_player_content(){
	const waiting_player_elem = document.getElementById(tournament_waiting_player_id);
	waiting_player_elem.replaceChildren(new_waiting_player_elem);
}


async function update_round_data(tournament_id)
{
	await regenerate_matches_elements(tournament_id);
	update_round_matches_content();
	update_waiting_player_content()
}



let modal_trounament_round_program = new bootstrap.Modal(document.getElementById(tournament_modal_id), {backdrop : "static", keyboard : false});

async function open_modal_tournament_round_program(tournament_id){
	await update_round_data(tournament_id);
	modal_trounament_round_program.show();
}