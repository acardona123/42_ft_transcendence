
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
	const url = "https://localhost:8443/api/tournaments/player/";

	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(player_data)
		});
		if (!fetched_data.ok)
		{
			let data = await fetched_data.json();
			console.log("error : ");
			console.log(data);
			throw new Error("Error while adding the player");
		}

		let data = await fetched_data.json();

		clearInputFields();
		AddCard('PLAYER', data.data.username, data.data.player_id);
	}
	catch (error)
	{
		console.log(error);
		document.getElementById('ErrorAddConnectedPlayer').textContent = 'Invalid connection. Please try again.';
		document.getElementById('ErrorAddConnectedPlayer').style.display = 'block';
	}
}

function OnClickAddConnectedPlayer() {
	btn = document.getElementById('ButtonAddConnectedPlayer');

	if (!btn)
		return;

	btn.addEventListener('click', () => {
		const username = document.getElementById('ConnectedPlayerPseudo').value;
		const pin = document.getElementById('PlayerConnectedPin').value;

		const errorMessage = CheckAddConnectedPlayer(username, pin);

		if (errorMessage) {
			document.getElementById('ErrorAddConnectedPlayer').textContent = errorMessage;
			document.getElementById('ErrorAddConnectedPlayer').style.display = 'block';

			/* Clear input */
			document.getElementById('PlayerConnectedPin').value = '';
			document.getElementById('PlayerConnectedPin').classList.remove('has-content');
		}
		else {
			const player_data = {
				tournament_id,
				username,
				pin,
			};

			tournament_add_player(player_data);
		}
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
	const url = "https://localhost:8443/api/tournaments/validate/";
	let fetched_data = await fetch_with_token(url, {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(tournament_data),
	});
	if (!fetched_data.ok)
	{
		throw new Error("Error while creating the tournament");
	}
}

function handleTournamentFormSubmission() {
	document.getElementById('TournamentForm').addEventListener('submit', async (event) => {
		event.preventDefault();

		timeSliderValue = document.getElementById('tournamentTimeSlider').value;
		pointsSliderValue = document.getElementById('tournamentPointsSlider').value;

		const max_duration = timeSliderValue === '310' ? '∞' : timeSliderValue;
		const max_score = pointsSliderValue === '12' ? '∞' : pointsSliderValue;

		const tournament_data = {
			tournament_id,
			game : (global_game_modal==="FLAPPYBIRD") ? "FB" : "PG",
			max_duration,
			max_score,
			nb_guest,
			nb_ai,
		};

		try {
			await submit_tournament_creation(tournament_data);

		} catch (error) {
			console.log(error);
			//TODO: FATAL ERROR: /////////////////////////////
			close_modal('modal-tournament-creation', undefined, true);
			create_popup("Error creating the tournament.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
			return;
		}

		close_modal('modal-tournament-creation', undefined, true);
		open_modal('modal-tournament-round-program', undefined, tournament_round_program_init, false);
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
	
	const button = document.getElementById('tournament_validate_button');

	button.disabled = true;

	// disableFormSubmitOnEnter('ConnectedPlayerPseudo');
	// disableFormSubmitOnEnter('PlayerConnectedPin');

}

async function create_tournament()
{
	const url = "https://localhost:8443/api/tournaments/create/";
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: {},
		});
		if (!fetched_data.ok)
		{
			// console.log("error : " + await fetched_data.json());
			throw new Error("Error while creating tournament.");
		}
		let body = await fetched_data.json();

		tournament_id = body.data.tournament_id;
	}
	catch (error)
	{
		console.log(error);
		//TODO fatal error
	}
}

function open_tournament()
{
	initTournamentCreation();
	modal_play.hide();
	create_tournament();
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

	handleTournamentFormSubmission();

});
