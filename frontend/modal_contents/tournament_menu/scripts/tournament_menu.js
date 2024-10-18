
function OnClickToggleContainerConnectedPlayer() {
	const btn = document.getElementById('ToggleConnectedPlayerContainer');

	if (!btn)
		return;

	btn.addEventListener('click', ToggleContainerConnectedPlayer);
}

function EscapeContainerConnectedPlayer(event) {
	if (event.key === 'Escape') {
		ToggleContainerConnectedPlayer();
	}
}

function LoseFocusContainerConnectedPlayer(event) {
	const toggleBtn = document.getElementById('ToggleConnectedPlayerContainer');
	const playerContainer = document.getElementById('AddConnectedPlayerContainer');

	if (!toggleBtn.contains(event.target) && !playerContainer.contains(event.target)) {
		ToggleContainerConnectedPlayer();
	}
}


function ToggleContainerConnectedPlayer() {
	const AddConnectedPlayerContainer = document.getElementById('AddConnectedPlayerContainer');

	if (!AddConnectedPlayerContainer)
		return;

	if (AddConnectedPlayerContainer.style.display === 'none' || AddConnectedPlayerContainer.style.display === '') {
		AddConnectedPlayerContainer.style.display = 'flex';

		/* Position */
		AddConnectedPlayerContainer.style.top = document.getElementById('ToggleConnectedPlayerContainer').offsetTop + document.getElementById('ToggleConnectedPlayerContainer').offsetHeight + 'px';
		// AddConnectedPlayerContainer.style.left = document.getElementById('ToggleConnectedPlayerContainer').offsetLeft + 'px';

		/* Animation */
		AddConnectedPlayerContainer.style.zIndex = '2';
		AddConnectedPlayerContainer.classList.remove('disappear');
		AddConnectedPlayerContainer.classList.add('appear');

		/* Set escape event */
		// document.removeEventListener('keydown', escape);
		document.addEventListener('keydown', EscapeContainerConnectedPlayer);
		document.addEventListener('click', LoseFocusContainerConnectedPlayer);


		AddConnectedPlayerContainer.addEventListener('animationend', function () {

			/* Focus on the input */
			document.getElementById('ConnectedPlayerPseudo').focus();
		}, { once: true });
	}
	else {
		/* Animation */
		AddConnectedPlayerContainer.style.zIndex = '0';
		AddConnectedPlayerContainer.classList.remove('appear');
		AddConnectedPlayerContainer.classList.add('disappear');

		/* Remove escape event */
		// document.addEventListener('keydown', escape);
		document.removeEventListener('keydown', EscapeContainerConnectedPlayer);
		document.removeEventListener('click', LoseFocusContainerConnectedPlayer);

		/* Focus on the button */
		document.getElementById('ToggleConnectedPlayerContainer').focus();

		AddConnectedPlayerContainer.addEventListener('animationend', function () {
			AddConnectedPlayerContainer.style.display = 'none';

			/* Clear input */
			AddConnectedPlayerContainer.getElementsByTagName('input')[0].value = '';
			AddConnectedPlayerContainer.getElementsByTagName('input')[0].classList.remove('has-content');
			AddConnectedPlayerContainer.getElementsByTagName('input')[1].value = '';
			AddConnectedPlayerContainer.getElementsByTagName('input')[1].classList.remove('has-content');
		}, { once: true });
	}
}

// -----------------------------------------------------------------------------------------------

function OnEnterInputConnectedPlayer() {
	const inputs = document.getElementById('AddConnectedPlayerContainer').getElementsByTagName('input');

	if (!inputs)
		return;

	for (let i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('keydown', function (event) {
			if (event.key === 'Enter') {
				event.preventDefault();
				document.getElementById('ButtonAddConnectedPlayer').click();
			}
		});
	}
}

function CheckAddConnectedPlayer(pseudo, pin) {
	let errorMessage = '';

	if (pseudo.length === 0) {
		errorMessage = 'Pseudo is required.';
	}
	else if (pin.length === 0) {
		errorMessage = 'Pin code is required.';
	}
	else if (pin.length !== 4 || !isdigit(pin)) {
		errorMessage = 'Pin code must be 4 digits.';
	}
	else {
		errorMessage = CheckAddCard(pseudo, 'PLAYER');
	}
	return errorMessage;
}

function OnClickAddConnectedPlayer() {
	btn = document.getElementById('ButtonAddConnectedPlayer');

	if (!btn)
		return;

	btn.addEventListener('click', () => {
		const pseudo = document.getElementById('ConnectedPlayerPseudo').value;
		const pin = document.getElementById('PlayerConnectedPin').value;

		console.log(pseudo);
		console.log(pin);

		const errorMessage = CheckAddConnectedPlayer(pseudo, pin);

		if (errorMessage) {
			document.getElementById('ErrorAddConnectedPlayer').textContent = errorMessage;
			document.getElementById('ErrorAddConnectedPlayer').style.display = 'block';

			/* Clear input */
			document.getElementById('PlayerConnectedPin').value = '';
			document.getElementById('PlayerConnectedPin').classList.remove('has-content');
		}
		else {
			fetch('/add-connected-player-in-tournament', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ pseudo, pin })
			})
				.then(response => response.json())
				.then(data => {
					if (data.success) {
						AddCard(pseudo, 'PLAYER');
						document.getElementById('ErrorAddConnectedPlayer').textContent = '';
						document.getElementById('ErrorAddConnectedPlayer').style.display = 'none';

						/* Clear input */
						document.getElementById('ConnectedPlayerPseudo').value = '';
						document.getElementById('ConnectedPlayerPseudo').classList.remove('has-content');
						document.getElementById('PlayerConnectedPin').value = '';
						document.getElementById('PlayerConnectedPin').classList.remove('has-content');
					}
					else {
						document.getElementById('ErrorAddConnectedPlayer').textContent = 'Invalid connection. Please try again.';
						document.getElementById('ErrorAddConnectedPlayer').style.display = 'block';
						
						/* Clear input */
						document.getElementById('PlayerConnectedPin').value = '';
						document.getElementById('PlayerConnectedPin').classList.remove('has-content');
					}
				})
				.catch(() => {
					document.getElementById('ErrorAddConnectedPlayer').textContent = 'Error connecting to server.';
					document.getElementById('ErrorAddConnectedPlayer').style.display = 'block';

					/* Clear input */
					document.getElementById('ConnectedPlayerPseudo').value = '';
					document.getElementById('ConnectedPlayerPseudo').classList.remove('has-content');
					document.getElementById('PlayerConnectedPin').value = '';
					document.getElementById('PlayerConnectedPin').classList.remove('has-content');
				});
			AddCard(pseudo, 'PLAYER');
		}
	});
}

function addFocusOutListener() {
	var inputs = document.querySelectorAll('.input-container input');

	inputs.forEach(function (input) {
		input.addEventListener('focusout', function () {
			if (input.value !== "") {
				input.classList.add('has-content');
			} else {
				input.classList.remove('has-content');
			}
		});
	});
}

function disableFormSubmitOnEnter(id) {
	document.getElementById(id).addEventListener('keydown', function (event) {
		if (event.key === 'Enter') {
			event.preventDefault();  // Prevent the form from submitting
		}
	});
}

function handleTounamentFormSubmission() {
	document.getElementById('TournamentForm').addEventListener('submit', (event) => {
		event.preventDefault();

		timeSliderValue = document.getElementById('tournamentTimeSlider').value;
		pointsSliderValue = document.getElementById('tournamentPointsSlider').value;

		const time = timeSliderValue === '310' ? '∞' : timeSliderValue;
		const points = pointsSliderValue === '12' ? '∞' : pointsSliderValue;

		const tournamentData = {
			time,
			points,
			IANumber,
			guestNumber,
		};

		console.log(tournamentData);

		// Send match data to the backend
		fetch('/create-tournament', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(tournamentData),
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					// alert('Match created successfully!');
				} else {
					// alert('Error creating match.');
				}
			})
			.catch(() => {
				// alert('Error connecting to server.');
			});
	});
}

// =================================================================================================
// =================================================================================================
// =================================================================================================

let playerGrid = undefined;
let playerCards = undefined;
let btnAddGuestPlayer = undefined;
let btnAddConnectedPlayer = undefined;
let ToggleConnectedPlayerContainer = undefined;
let buttonAddIA = undefined;
let debugOutput = undefined;

const numRows = 4;
const numCols = 4;
const arrayCardPosToNumber = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];

const maxCards = 16;
let cardsNumber = 1;
let IANumber = 0;
let guestNumber = 0;
let playerNumber = 1;
let playerList = [];

function updateGrid() {
	for (let i = 0; i < playerList.length; ++i) {
		let column = i % numCols;
		let row = Math.floor(i / numCols);
		let idCol = column * numRows;
		let index = idCol + row;

		const card = playerCards[index];
		card.textContent = playerList[i].name;
		card.classList.add('show');
		if (playerList[i].type === 'IA') {
			card.style.backgroundColor = '#28a745';
		} else if (playerList[i].type === 'GUEST') {
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
	for (let i = playerList.length; i < maxCards; ++i) {
		let column = i % numCols;
		let row = Math.floor(i / numCols);
		let idCol = column * numRows;
		let index = idCol + row;

		const card = playerCards[index];
		card.textContent = `Player ${i + 1}`;
		card.classList.remove('show');
		card.style.backgroundColor = '#fff';
	}
}

function disableButtons() {
	if (cardsNumber >= maxCards) {
		ToggleConnectedPlayerContainer.disabled = true;
		btnAddConnectedPlayer.disabled = true;
		btnAddGuestPlayer.disabled = true;
		buttonAddIA.disabled = true;
	} else {
		ToggleConnectedPlayerContainer.disabled = false;
		btnAddConnectedPlayer.disabled = false;
		btnAddGuestPlayer.disabled = false;
		buttonAddIA.disabled = false;
	}
}

function CheckAddCard(name, type)
{
	if (cardsNumber < maxCards)
	{
		if (type === 'PLAYER' && playerList.find(item => item.name === name)) {
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
	if (cardsNumber < maxCards) {

		if (type === 'PLAYER') {
			++playerNumber;
			const lastPlayerIndex = playerList.findLastIndex(item => item.type === 'PLAYER');
			if (lastPlayerIndex === -1) {
				playerList.push({ name, type });
			} else {
				playerList.splice(lastPlayerIndex + 1, 0, { name, type });
			}
		}
		else if (type === 'GUEST') {
			++guestNumber;
			const lastGuestIndex = playerList.findLastIndex(item => item.type === 'GUEST');
			const lastPlayerIndex = playerList.findLastIndex(item => item.type === 'PLAYER');
			if (lastGuestIndex === -1 && lastPlayerIndex === -1) {
				playerList.push({ name, type });
			} else if (lastGuestIndex === -1) {
				playerList.splice(lastPlayerIndex + 1, 0, { name, type });
			} else {
				playerList.splice(lastGuestIndex + 1, 0, { name, type });
			}
		}
		else {
			playerList.push({ name, type }); // Add the name and type to the array
			++IANumber;
		}

		++cardsNumber;

		updateDebugOutput(); // Update the debug output
		updateGrid(); // Update the grid
		disableButtons();
	}
}

async function deleteCard(cardElement) {
	const cardIndex = arrayCardPosToNumber[playerCards.indexOf(cardElement)];
	if (cardIndex !== -1)
	{
		--cardsNumber;
		switch (playerList[cardIndex].type)
		{
			case 'PLAYER':
				await fetch('/delete-connected-player-in-tournament', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ name: playerList[cardIndex].name })
				})
					.then(response => response.json())
					.then(data => {
						if (data.success) {
							--playerNumber;
							shiftCards(cardIndex);
							playerList.pop();
						} else {
							++cardsNumber;
						}
					})
					.catch(() => {
						--playerNumber;
						shiftCards(cardIndex);
						playerList.pop();
					});
				break;

			case 'GUEST':
				--guestNumber;
				const lastGuestIndex = playerList.findLastIndex(item => item.type === 'GUEST');
				if (lastGuestIndex === -1) {
					playerList.pop();
				} else {
					shiftCards(lastGuestIndex);
					playerList.pop();
				}
				break;

			case 'IA':
				--IANumber;
				playerList.pop();
				break;

			default:
				break;
		}

		updateDebugOutput();
		updateGrid();
		disableButtons();
	}
}

const cardNumberToPos = (cardNumber) => {
	return arrayCardPosToNumber.indexOf(cardNumber);
}

function shiftCards(startCardIndex) {
	for (let i = startCardIndex; i < playerList.length; ++i) {
		playerList[i] = playerList[i + 1];
	}
	updateDebugOutput();
}

function updateDebugOutput() {
	// Convert the playerList array to a formatted string
	debugOutput.textContent = `Debug Output: playerList Array\n${JSON.stringify(playerList, null, 2)}`;
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
		// const guestName = `Guest ${guestNumber + 1}`;
		AddCard(guestName, 'GUEST');
	});
}

function eventAddIA() {
	
	buttonAddIA.addEventListener('click', (event) => {
		event.preventDefault();
		const iaName = `IA`;
		// const iaName = `IA ${IANumber + 1}`;
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
	buttonAddIA = document.getElementById('ButtonAddIA');
	debugOutput = document.getElementById('debugOutput');

	cardsNumber = 1;
	IANumber = 0;
	guestNumber = 0;
	playerNumber = 1;
	playerList = [];

	/* Set array */
	playerList.push({name: "PATATOR", type: 'PLAYER'});
	// playerList.push({name: global_user_infos.username, type: 'PLAYER'});
	updateGrid();


}

function initTournamentCreation() {
	modal_play.hide();

	const sliderTime = document.getElementById('tournamentTimeSlider');
	const sliderPoints = document.getElementById('tournamentPointsSlider');

	sliderTime.value = 45;
	sliderPoints.value = 5;

	/* Slider */
	updateSlider("TournamentForm");
	
	/* Visual Features */
	clearInputFields();
	
	initPlayerGird();

	// disableFormSubmitOnEnter('ConnectedPlayerPseudo');
	// disableFormSubmitOnEnter('PlayerConnectedPin');
}

document.addEventListener("onModalsLoaded", () => {
	initTournamentCreation();


	document.addEventListener('keydown', (event) => {
		if (event.key === "Escape") {
			returnToModalPlay("TournamentMatchCreation")
		}
	});

	pincodeOnlyDigits();
	OnClickToggleContainerConnectedPlayer();
	OnEnterInputConnectedPlayer();
	OnClickAddConnectedPlayer();

	eventDeleteCard();
	eventAddGuestPlayer();
	eventAddIA();

	handleTounamentFormSubmission();

});
