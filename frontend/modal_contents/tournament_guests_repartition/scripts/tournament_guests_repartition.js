const tournament_guests_list_id = "tgr-guests-list"
const tournament_guests_instructions = "tgr-instructions"

async function get_guests_list_from_DB()
{
	const url = `https://localhost:8443/api/tournaments/guests/?tournament_id=${tournament_id}`;

	try
	{
		let data_fetched = await fetch_with_token(url, {
			method: 'GET',
			headers: {}
		});
		let body = await data_fetched.json();

		if (!data_fetched.ok)
			throw new Error(`${body.get("message", "internal error")}`);
		return body.data;
	}
	catch (error)
	{
		create_popup(`Retrieving round matches failed: ${error.message}`,
			2000, 4000,
			hex_color=HEX_RED, t_hover_color=HEX_RED_HOVER);
		//TODO ////////////////////////
		//==============================================================================
		// retour a la page d'accueil ?
		//==============================================================================
		return undefined;
	}

}


// ==== Loading interface ====

function tournament_guests_repartition_loading_elements(){
	let loading_text = document.createElement('p');
	loading_text.textContent = "Loading...";

	const round_matches_elem = document.getElementById(tournament_guests_list_id);
	round_matches_elem.replaceChildren(loading_text);
}


// ==== guests data generation ====

let new_guests_list = [];


function add_guest_to_updated_list(guest_username){

	let new_guest_div = document.createElement('div');
	new_guest_div.className = "tgr-guest-elem"

	let guest_username_text = document.createElement('p');
	guest_username_text.textContent = guest_username;
	guest_username_text.className = "tgr-guest-username";

	new_guest_div.appendChild(guest_username_text);

	new_guest_div.addEventListener('click', () => {
        new_guest_div.classList.toggle('active');
    });

	new_guests_list.push(new_guest_div);
}

async function regenerate_guests_elements(){
	new_guests_list = [];

	const guests_data = await get_guests_list_from_DB();
	guests_data.forEach(guest => {
		add_guest_to_updated_list(guest)
	});

}


// guests instructions:

function get_no_guest_instructions(){
	const no_guest_instructions = document.createElement('p');
	no_guest_instructions.textContent = "There is no guest in this tournament.";
	return no_guest_instructions;
}

function get_guests_instructions(){
	const guest_instructions = document.createElement('p');
	guest_instructions.textContent = "Dear guests, here is the lists of the pseudos you'll have during this tournament. Chose which one is who's, but remember: you'll have plenty of time to fight later so stay calm.";
	return guest_instructions;
}


//guests list:


function update_guests_instructions_display(){
	let instructions_content;
	if (new_guests_list.length == 0){
		instructions_content = get_no_guest_instructions();
	} else {
		instructions_content = get_guests_instructions();
	}
	let instructions_elem = document.getElementById(tournament_guests_instructions);
	instructions_elem.replaceChildren(instructions_content);
}

function update_guests_lists_display(){
	let guest_list = document.getElementById(tournament_guests_list_id);
	if (new_guests_list.length == 0){
		const no_guest_elem = generate_no_guest_element();
		guest_list.replaceChildren(no_guest_elem);
	} else {
		guest_list.innerHTML = '';
		new_guests_list.forEach(guest => {
			guest_list.appendChild(guest);
		});
	}
}


// all modal display

function update_guests_display(){
	update_guests_instructions_display();
	update_guests_lists_display();
}


// ==== guest list modal start  ====

function tournament_guest_continue_next(){
	close_modal('modal-tournament-guests-repartition', undefined, false);
	open_modal('modal-tournament-round-program', undefined, init_modal_tournament_round_program, false);
}
