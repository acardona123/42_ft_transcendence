
function OnClickToggleContainerConnectedPlayer() {
	const btn = document.getElementById('ToggleConnectedPlayerContainer');

	if (!btn)
		return;

	btn.addEventListener('click', ToggleContainerConnectedPlayer);
}

// function EscapeContainerConnectedPlayer(event) {
// 	if (event.key === 'Escape') {
// 		ToggleContainerConnectedPlayer();
// 	}
// }

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
		// document.addEventListener('keydown', EscapeContainerConnectedPlayer);
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
		// document.removeEventListener('keydown', EscapeContainerConnectedPlayer);
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

async function tournament_add_player(player_data)
{
	const url = "/add-connected-player-in-tournament/";

	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(player_data)
		});
		if (!fetched_data.ok)
			throw new Error("Error while adding the player");

		clearInputFields();
		AddCard(pseudo, 'PLAYER');
	}
	catch (error)
	{
		document.getElementById('ErrorAddConnectedPlayer').textContent = 'Invalid connection. Please try again.';
		document.getElementById('ErrorAddConnectedPlayer').style.display = 'block';
	}
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
			let player_data = {pseudo, pin};

			tournament_add_player(player_data);
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

async function submit_tournament_creation(tournament_data)
{
	const url = "/create-tournament/";
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(tournament_data),
		});
		if (!fetched_data.ok)
		{
			throw new Error("Error while creating the tournament");
		}

		let data = await fetched_data.json();

		console.log(data);
		console.log("create Tournament");

		close_modal('modal-tournament-creation', undefined, false);
		open_modal('modal-game', undefined, undefined, false);

	}
	catch (error)
	{
		console.log(error);
	}
}

function handleTounamentFormSubmission() {
	document.getElementById('TournamentForm').addEventListener('submit', async (event) => {
		event.preventDefault();

		timeSliderValue = document.getElementById('tournamentTimeSlider').value;
		pointsSliderValue = document.getElementById('tournamentPointsSlider').value;

		const time = timeSliderValue === '310' ? '∞' : timeSliderValue;
		const points = pointsSliderValue === '12' ? '∞' : pointsSliderValue;

		const tournament_data = {
			time,
			points,
			number_ia,
			number_guest,
		};

			submit_tournament_creation(tournament_data);

		console.log(tournament_data);

	});
}

function tournament_creation_setup_display_on_game()
{
	const header = document.getElementById('tournament-menu-header-text');
	const slider_label = document.getElementById('tournament-point-label');
	const button_ia = document.getElementById('button_add_ia');

	if (global_game_modal === "FLAPPYBIRD")
	{
		header.textContent = "CREATE A FLAPPY BIRD TOURNAMENT";
		slider_label.textContent = "Deaths:";
		button_ia.disable = true;
		button_ia.style.display = 'none';
	}
	else
	{
		header.textContent = "CREATE A PONG TOURNAMENT";
		slider_label.textContent = "Points:";
		button_ia.disable = false;
		button_ia.style.display = 'flex';
	}
}

function initTournamentCreation() {
	tournament_creation_setup_display_on_game();

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

	modal_play.hide();
}

document.addEventListener("onModalsLoaded", () => {
	initTournamentCreation();


	// document.addEventListener('keydown', (event) => {
	// 	if (event.key === "Escape") {
	// 		returnToModalPlay("TournamentMatchCreation")
	// 	}
	// });

	pincodeOnlyDigits('PlayerConnectedPin');
	OnClickToggleContainerConnectedPlayer();
	OnEnterInputConnectedPlayer();
	OnClickAddConnectedPlayer();

	eventDeleteCard();
	eventAddGuestPlayer();
	eventAddIA();

	handleTounamentFormSubmission();

});
