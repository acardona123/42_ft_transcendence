
function OnClickToggleContainerConnectedPlayer() {
	const btn = document.getElementById('tournament-button-toggle-add-player-container');

	if (!btn)
		return;

	btn.addEventListener('click', ToggleContainerConnectedPlayer);
}

function LoseFocusContainerConnectedPlayer(event) {
	const toggleBtn = document.getElementById('tournament-button-toggle-add-player-container');
	const playerContainer = document.getElementById('tournament-add-player-container');

	if (!toggleBtn.contains(event.target) && !playerContainer.contains(event.target)) {
		ToggleContainerConnectedPlayer();
	}
}

function set_position_tournament_add_player_container()
{
	const container_add_player = document.getElementById('tournament-add-player-container');

	container_add_player.style.top = document.getElementById('tournament-button-toggle-add-player-container').offsetTop + document.getElementById('tournament-button-toggle-add-player-container').offsetHeight / 3 + 'px';
	// container_add_player.style.left = document.getElementById('tournament-button-toggle-add-player-container').offsetLeft + 'px';

}

function ToggleContainerConnectedPlayer() {
	const container_add_player = document.getElementById('tournament-add-player-container');

	if (!container_add_player)
		return;

	if (container_add_player.style.display === 'none' || container_add_player.style.display === '') {
		container_add_player.style.display = 'flex';

		/* Position */
		set_position_tournament_add_player_container();

		/* Animation */
		container_add_player.style.zIndex = '2';
		container_add_player.classList.remove('disappear');
		container_add_player.classList.add('appear');

		/* Set escape event */
		// document.addEventListener('keydown', EscapeContainerConnectedPlayer);
		document.addEventListener('click', LoseFocusContainerConnectedPlayer);


		container_add_player.addEventListener('animationend', function () {

			/* Focus on the input */
			document.getElementById('ConnectedPlayerPseudo').focus();
		}, { once: true });
	}
	else {
		/* Animation */
		container_add_player.style.zIndex = '0';
		container_add_player.classList.remove('appear');
		container_add_player.classList.add('disappear');

		/* Remove escape event */
		// document.removeEventListener('keydown', EscapeContainerConnectedPlayer);
		document.removeEventListener('click', LoseFocusContainerConnectedPlayer);

		/* Focus on the button */
		document.getElementById('tournament-button-toggle-add-player-container').focus();

		container_add_player.addEventListener('animationend', function () {
			container_add_player.style.display = 'none';

			document.getElementById('tournament-add-player-error-div').style.display = 'none';

			/* Clear input */
			container_add_player.getElementsByTagName('input')[0].value = '';
			container_add_player.getElementsByTagName('input')[0].classList.remove('has-content');
			container_add_player.getElementsByTagName('input')[1].value = '';
			container_add_player.getElementsByTagName('input')[1].classList.remove('has-content');
		}, { once: true });
	}
}

// -----------------------------------------------------------------------------------------------

function OnEnterInputConnectedPlayer() {
	const inputs = document.getElementById('tournament-add-player-container').getElementsByTagName('input');

	if (!inputs)
		return;

	for (let i = 0; i < inputs.length; i++) {
		inputs[i].addEventListener('keydown', function (event) {
			if (event.key === 'Enter') {
				event.preventDefault();
				document.getElementById('tournament_button_add_player').click();
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
	const error_div = document.getElementById('tournament-add-player-error-div');

	const url = "/api/tournaments/player/";

	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(player_data)
		});
		if (!fetched_data.ok)
		{
			if (fetched_data.status === 403)
			{
				error_div.children[0].textContent = "Incorrect username or pin";
				error_div.style.display = "initial";
				return ;
			}
			else
			{
				error_div.style.display = "none";
				throw new Error();
			}
		}

		let data = await fetched_data.json();

		clearInputFields();
		error_div.style.display = "none";
		AddCard('PLAYER', data.data.username, data.data.player_id);
	}
	catch (error)
	{
		create_popup("Error while adding the player.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
	}
}

function OnClickAddConnectedPlayer() {
	btn = document.getElementById('tournament_button_add_player');

	if (!btn)
		return;

	btn.addEventListener('click', () => {
		const username = document.getElementById('ConnectedPlayerPseudo').value;
		const pin = document.getElementById('tournament-player-pin-input').value;

		const errorMessage = CheckAddConnectedPlayer(username, pin);

		if (errorMessage) {
			document.getElementById('tournament-add-player-error-div').children[0].textContent = errorMessage;
			document.getElementById('tournament-add-player-error-div').style.display = 'initial';

			/* Clear input */
			document.getElementById('tournament-player-pin-input').value = '';
			document.getElementById('tournament-player-pin-input').classList.remove('has-content');
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

async function submit_tournament_validation(tournament_data)
{
	const url = "/api/tournaments/validate/";
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

		close_modal('modal-tournament-creation', undefined, false);

		document.getElementById('tournament_validate_button').disabled = false;
		document.getElementById('tournament_validate_button').classList.remove('loading');

		if (tournament_data.nb_guest > 0){
			open_modal('modal-tournament-guests-repartition', undefined, init_modal_tournament_guests_repartition, false);
		} else {
			open_modal('modal-tournament-round-program', undefined, init_modal_tournament_round_program, false);
		}

		stop_click_on_all_page = false;
	}
	catch (error)
	{
		stop_click_on_all_page = false;

		document.getElementById('tournament_validate_button').disabled = false;
		document.getElementById('tournament_validate_button').classList.remove('loading');

		create_popup("Error while creating tournament.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
		console.log(error);
	}
}

function handleTournamentFormSubmission() {
	document.getElementById('tournament-form').addEventListener('submit', async (event) => {
		event.preventDefault();

		timeSliderValue = document.getElementById('tournamentTimeSlider').value;
		pointsSliderValue = document.getElementById('tournamentPointsSlider').value;

		const max_duration = timeSliderValue === '310' ? '-1' : timeSliderValue;
		const max_score = pointsSliderValue === '12' ? '-1' : pointsSliderValue;

		const tournament_data = {
			tournament_id,
			game : (global_game_modal==="FLAPPYBIRD") ? "FB" : "PG",
			max_duration,
			max_score,
			nb_guest,
			nb_ai,
		};

		document.getElementById('tournament_validate_button').classList.add('loading');
		document.getElementById('tournament_validate_button').disabled = true;

		stop_click_on_all_page = true;

		submit_tournament_validation(tournament_data);
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
		button_ia.style.display = 'block';
	}
}

function check_not_enough_player_tournament()
{
	const button = document.getElementById('tournament_validate_button');

	const sliders = Array.from(document.getElementById('tournament-form').querySelectorAll('.slider'));

	const countMaxValues = sliders.filter(slider => slider.value === slider.max).length;

	if (countMaxValues > 1)
	{
		button.disabled = true;
	}
	else
	{
		if (nb_cards >= 3)
			button.disabled = false;
		else
			button.disabled = true;
	}
}

function init_tournament_menu() {
	tournament_creation_setup_display_on_game();

	const sliderTime = document.getElementById('tournamentTimeSlider');
	const sliderPoints = document.getElementById('tournamentPointsSlider');

	sliderTime.value = 45;
	sliderPoints.value = 5;

	/* Slider */
	updateSlider("tournament-form");

	/* Visual Features */
	clearInputFields();

	initPlayerGird();
	
	document.getElementById('tournament_validate_button').disabled = true;
	document.getElementById('tournament_validate_button').classList.remove('loading');

	document.getElementById('tournament-add-player-error-div').style.display = 'none';

}

async function create_tournament()
{
	const url = "/api/tournaments/create/";
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: {},
		});
		if (!fetched_data.ok)
		{
			throw new Error("Error while creating tournament.");

		}
		let body = await fetched_data.json();

		tournament_id = body.data.tournament_id;

	}
	catch (error)
	{
		alert("Sorry there has been an error while creating tournament.\nPlease retry and, if the problem is persistent, reload the page")
		close_modal('modal-tournament-creation', undefined, false);
	}
}

function open_tournament()
{
	init_tournament_menu();
	modal_play.hide();
	create_tournament();
}

document.addEventListener("onModalsLoaded", () => {
	init_tournament_menu();

	pincodeOnlyDigits('tournament-player-pin-input');
	OnClickToggleContainerConnectedPlayer();
	OnEnterInputConnectedPlayer();
	OnClickAddConnectedPlayer();

	eventAddGuestPlayer();
	eventAddIA();
	window.addEventListener("resize", set_position_tournament_add_player_container);

	handleTournamentFormSubmission();

});
