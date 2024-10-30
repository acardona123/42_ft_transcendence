let playerGrid;
let tournament_cards;
let btnAddGuestPlayer;
let btnAddConnectedPlayer;
let tournament_button_toggle_add_player_container;
let button_add_ia;

const rows_number = 4;
const cols_number = 4;
const array_card_pos_to_number = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];

const max_cards = 16;
let nb_cards = 1;
let nb_ai = 0;
let nb_guest = 0;
let nb_player = 1;
let player_list = undefined;

function updateGrid() {
	for (let i = 0; i < nb_cards; ++i)
	{
		let column = i % cols_number;
		let row = Math.floor(i / cols_number);
		let idCol = column * rows_number;
		let index = idCol + row;

		const card = tournament_cards[index];
		card.classList.remove('player-card', 'guest-card', 'ai-card');
		if (i < nb_player)
		{
			card.textContent = player_list[i].username;
			card.classList.add('show');
			if (i == 0)
				card.classList.add('host-card');
			else
			card.classList.add('player-card');
		}
		else if (i < nb_player + nb_guest)
		{
			card.textContent = 'GUEST';
			card.classList.add('show');
			card.classList.add('guest-card');
		}
		else if (i < nb_player + nb_guest + nb_ai)
		{
			card.textContent = 'AI';
			card.classList.add('show');
			card.classList.add('ai-card');
		}

		if (i !== 0) {
			const delete_card = document.createElement('img');
			delete_card.className = "card-delete-button";
			delete_card.src = "main_srcs/img/remove_friend.png";
			delete_card.onclick = on_click_delete_card;
			card.appendChild(delete_card);
		}
	}

	for (let i = nb_cards; i < max_cards; ++i) {
		let column = i % cols_number;
		let row = Math.floor(i / cols_number);
		let idCol = column * rows_number;
		let index = idCol + row;

		const card = tournament_cards[index];
		card.textContent = `Player ${i + 1}`;
		card.classList.remove('show');
		card.style.backgroundColor = '#fff';
	}
}

function disable_tournaments_buttons() {
	if (nb_cards >= max_cards) {
		tournament_button_toggle_add_player_container.disabled = true;
		btnAddConnectedPlayer.disabled = true;
		btnAddGuestPlayer.disabled = true;
		button_add_ia.disabled = true;
	} else {
		tournament_button_toggle_add_player_container.disabled = false;
		btnAddConnectedPlayer.disabled = false;
		btnAddGuestPlayer.disabled = false;
		button_add_ia.disabled = false;
	}

	if (get_max_values_from_form("tournament-form") <= 1 && nb_cards >= 3)
	{
		document.getElementById('tournament_validate_button').disabled = false;
	}
	else
	{
		document.getElementById('tournament_validate_button').disabled = true;
	}
}

function CheckAddCard(name, type)
{
	if (nb_cards < max_cards)
	{
		if (type === 'PLAYER' && player_list.find(item => item.username === name)) {
				return "Player is already in the tournament.";
		}
		else
			return "";
	}
	else
	{
		return "No more slots available.";
	}
}

function AddCard(type, username, id = -1) {
	if (nb_cards < max_cards) {

		if (type === 'PLAYER') {
			++nb_player;
			player_list.push({ username, id });
		}
		else if (type === 'GUEST') {
			++nb_guest;
		}
		else {
			++nb_ai;
		}

		++nb_cards;

		updateGrid(); // Update the grid
		disable_tournaments_buttons();

	}
}

async function tournament_delete_player(index_card)
{
	const url = "/api/tournaments/player/" + "?" + new URLSearchParams({
		player_id: player_list[index_card].id,
        tournament_id: tournament_id,
    }).toString();

	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'DELETE',
			headers: {},
		})
		if (!fetched_data.ok)
		{
			let data = await fetched_data.json();
			throw new Error("Error with deleting player");
		}

		let data = await fetched_data.json();

		--nb_player;
		player_list.splice(index_card, 1);
	}
	catch (error)
	{
		++nb_cards;
	}
}

async function deleteCard(cardElement, type) {
	const index_card = array_card_pos_to_number[tournament_cards.indexOf(cardElement)];
	if (index_card !== -1)
	{
		--nb_cards;
		switch (type)
		{
			case 'PLAYER':
				await tournament_delete_player(index_card);
				break;

			case 'GUEST':
				--nb_guest;
				break;

			case 'AI':
				--nb_ai;
				break;

			default:
				++nb_cards;
				break;
		}

		updateGrid();
		disable_tournaments_buttons();
	}
}

const cardNumberToPos = (cardNumber) => {
	return array_card_pos_to_number.indexOf(cardNumber);
}

function on_click_delete_card(event)
{
	event.preventDefault();
	const card = event.target.parentElement;
	if (card.classList.contains('player-card'))
	{
		deleteCard(card, 'PLAYER');
	}
	else if (card.classList.contains('guest-card'))
	{
		deleteCard(card, 'GUEST');
	}
	else if (card.classList.contains('ai-card'))
	{
		deleteCard(card, 'AI');
	}
}

function eventAddGuestPlayer() {

	btnAddGuestPlayer.addEventListener('click', (event) => {
		event.preventDefault();
		const guestName = `Guest`;
		// const guestName = `Guest ${nb_guest + 1}`;
		AddCard('GUEST', guestName);
	});
}

function eventAddIA() {
	
	button_add_ia.addEventListener('click', (event) => {
		event.preventDefault();
		const iaName = `IA`;
		// const iaName = `IA ${nb_ai + 1}`;
		AddCard('IA', iaName);
	});
}


function initPlayerGird() {

	/* Set var */
	playerGrid = document.getElementById('PlayerGrid');
	tournament_cards = Array.from(playerGrid.getElementsByClassName('tournament-card'));
	btnAddGuestPlayer = document.getElementById('tournament-button-add-guest');
	btnAddConnectedPlayer = document.getElementById('tournament_button_add_player');
	tournament_button_toggle_add_player_container = document.getElementById('tournament-button-toggle-add-player-container');
	button_add_ia = document.getElementById('button_add_ia');

	nb_cards = 1;
	nb_ai = 0;
	nb_guest = 0;
	nb_player = 0;
	player_list = [];
	
	/* Set array */
	if (global_user_infos)
	{
		nb_player = 1;
		player_list.push({username: global_user_infos.username, id : -1});
	}

	updateGrid();
	disable_tournaments_buttons();
}
