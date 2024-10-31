const tournament_guests_list_id = "tgr-guests-list"
const tournament_guests_instructions = "tgr-instructions"

async function get_guests_list_from_DB()
{
	const url = `/api/tournaments/guests/?tournament_id=${tournament_id}`;

	try {
		let data_fetched = await fetch_with_token(url, {
			method: 'GET',
			headers: {}
		});
		let body = await data_fetched.json();

		if (!data_fetched.ok)
			throw Error;
		return body.data;
	}
	catch {
		alert("Sorry but we failed to retrieve the guests list for this tournament.\nTherefore you'll have to deduce them from the matches list of the first round displayed after this step.\nA guest name is build like this:\n{random word}#{random number}.\n\nIf you want to you will also have the possibility to cancel the tournament during this same step by clicking on the top right corner cross")
		return [];
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
	guest_instructions.textContent = "Dear guests, here is the list of the pseudos you'll have during this tournament. Chose which one is who's, but remember: you'll have plenty of time to fight later so stay calm.";
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
	guest_list.innerHTML = '';
	new_guests_list.forEach(guest => {
		guest_list.appendChild(guest);
	});
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
