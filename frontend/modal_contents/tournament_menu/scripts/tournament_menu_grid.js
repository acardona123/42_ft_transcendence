let playerGrid;
let playerCards;
let btnAddGuestPlayer;
let btnAddConnectedPlayer;
let ToggleConnectedPlayerContainer;
let button_add_ia;

const rows_number = 4;
const cols_number = 4;
const array_card_pos_to_number = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];

const max_cards = 16;
let number_cards = 1;
let number_ia = 0;
let number_guest = 0;
let number_player = 1;
let player_list = [];

function updateGrid() {
	for (let i = 0; i < player_list.length; ++i) {
		let column = i % cols_number;
		let row = Math.floor(i / cols_number);
		let idCol = column * rows_number;
		let index = idCol + row;

		const card = playerCards[index];
		card.textContent = player_list[i].name;
		card.classList.add('show');
		if (player_list[i].type === 'IA') {
			card.style.backgroundColor = '#28a745';
		} else if (player_list[i].type === 'GUEST') {
			card.style.backgroundColor = '#ffc107';
		} else {
			card.style.backgroundColor = '#007bff';
		}

		if (i !== 0) {
			const deleteButton = document.createElement('button');
			deleteButton.textContent = 'X';
			deleteButton.classList.add('delete-button');
			card.appendChild(deleteButton);
		}
	}
	for (let i = player_list.length; i < max_cards; ++i) {
		let column = i % cols_number;
		let row = Math.floor(i / cols_number);
		let idCol = column * rows_number;
		let index = idCol + row;

		const card = playerCards[index];
		card.textContent = `Player ${i + 1}`;
		card.classList.remove('show');
		card.style.backgroundColor = '#fff';
	}
}

function disable_tournaments_buttons() {
	if (number_cards >= max_cards) {
		ToggleConnectedPlayerContainer.disabled = true;
		btnAddConnectedPlayer.disabled = true;
		btnAddGuestPlayer.disabled = true;
		button_add_ia.disabled = true;
	} else {
		ToggleConnectedPlayerContainer.disabled = false;
		btnAddConnectedPlayer.disabled = false;
		btnAddGuestPlayer.disabled = false;
		button_add_ia.disabled = false;
	}
}

function CheckAddCard(name, type)
{
	if (number_cards < max_cards)
	{
		if (type === 'PLAYER' && player_list.find(item => item.name === name)) {
				return "Player already exists.";
		}
		else
			return "";
	}
	else
	{
		return "No more slots available.";
	}
}

function AddCard(name, type) {
	if (number_cards < max_cards) {

		if (type === 'PLAYER') {
			++number_player;
			const lastPlayerIndex = player_list.findLastIndex(item => item.type === 'PLAYER');
			if (lastPlayerIndex === -1) {
				player_list.push({ name, type });
			} else {
				player_list.splice(lastPlayerIndex + 1, 0, { name, type });
			}
		}
		else if (type === 'GUEST') {
			++number_guest;
			const lastGuestIndex = player_list.findLastIndex(item => item.type === 'GUEST');
			const lastPlayerIndex = player_list.findLastIndex(item => item.type === 'PLAYER');
			if (lastGuestIndex === -1 && lastPlayerIndex === -1) {
				player_list.push({ name, type });
			} else if (lastGuestIndex === -1) {
				player_list.splice(lastPlayerIndex + 1, 0, { name, type });
			} else {
				player_list.splice(lastGuestIndex + 1, 0, { name, type });
			}
		}
		else {
			player_list.push({ name, type }); // Add the name and type to the array
			++number_ia;
		}

		++number_cards;

		updateGrid(); // Update the grid
		disable_tournaments_buttons();
	}
}

async function tournament_delete_player()
{
	const url = "/delete-connected-player-in-tournament/";

	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify( {name: player_list[cardIndex].name })
		})
		if (!fetched_data.ok)
		{
			throw new Error("Error with deleting player");
		}

		--number_player;
		shiftCards(cardIndex);
		player_list.pop();
	}
	catch (error)
	{
		++number_cards;
		console.log(error);
	}
}

async function deleteCard(cardElement) {
	const cardIndex = array_card_pos_to_number[playerCards.indexOf(cardElement)];
	if (cardIndex !== -1)
	{
		--number_cards;
		switch (player_list[cardIndex].type)
		{
			case 'PLAYER':
				await tournament_delete_player();

			case 'GUEST':
				--number_guest;
				const lastGuestIndex = player_list.findLastIndex(item => item.type === 'GUEST');
				if (lastGuestIndex === -1) {
					player_list.pop();
				} else {
					shiftCards(lastGuestIndex);
					player_list.pop();
				}
				break;

			case 'IA':
				--number_ia;
				player_list.pop();
				break;

			default:
				break;
		}

		updateGrid();
		disable_tournaments_buttons();
	}
}

const cardNumberToPos = (cardNumber) => {
	return array_card_pos_to_number.indexOf(cardNumber);
}

function shiftCards(startCardIndex) {
	for (let i = startCardIndex; i < player_list.length; ++i) {
		player_list[i] = player_list[i + 1];
	}
}

function eventDeleteCard() {

	playerGrid.addEventListener('click', (event) => {
		if (event.target.classList.contains('delete-button')) {
			event.preventDefault();
			const card = event.target.parentElement;
			deleteCard(card);
		}
	});
}

function eventAddGuestPlayer() {

	btnAddGuestPlayer.addEventListener('click', (event) => {
		event.preventDefault();
		const guestName = `Guest`;
		// const guestName = `Guest ${number_guest + 1}`;
		AddCard(guestName, 'GUEST');
	});
}

function eventAddIA() {
	
	button_add_ia.addEventListener('click', (event) => {
		event.preventDefault();
		const iaName = `IA`;
		// const iaName = `IA ${number_ia + 1}`;
		AddCard(iaName, 'IA');
	});
}


function initPlayerGird() {

	/* Set var */
	playerGrid = document.getElementById('PlayerGrid');
	playerCards = Array.from(playerGrid.getElementsByClassName('player-card'));
	btnAddGuestPlayer = document.getElementById('ButtonAddGuestPlayer');
	btnAddConnectedPlayer = document.getElementById('ButtonAddConnectedPlayer');
	ToggleConnectedPlayerContainer = document.getElementById('ToggleConnectedPlayerContainer');
	button_add_ia = document.getElementById('button_add_ia');

	number_cards = 1;
	number_ia = 0;
	number_guest = 0;
	number_player = 1;
	player_list = [];

	/* Set array */
	player_list.push({name: "PATATOR", type: 'PLAYER'});
	// player_list.push({name: global_user_infos.username, type: 'PLAYER'});
	updateGrid();


}
