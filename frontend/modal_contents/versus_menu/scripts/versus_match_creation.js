function disable_buttons_versus_form() {
	const versus_guest_button = document.getElementById('versus-guest-validate-button');
	const versus_player_button = document.getElementById('versus-player-validate-button');

	const BoxVSGuest = document.getElementById('BoxVSGuest');
	const BoxVSPlayer = document.getElementById('BoxVSPlayer');

	const sliders = Array.from(document.getElementById('versus-match-form').querySelectorAll('.slider'));

	const countMaxValues = sliders.filter(slider => slider.value === slider.max).length;

	if (countMaxValues > 1)
	{
		versus_guest_button.disabled = true;
		versus_player_button.disabled = true;
	}
	else
	{
		if (BoxVSGuest.classList.contains('centered', 'side'))
			versus_guest_button.disabled = false;
		else if (BoxVSPlayer.classList.contains('centered', 'side'))
			versus_player_button.disabled = false;
	}
}

function reset_box_display()
{
	const BoxVSGuest = document.getElementById('BoxVSGuest');
	const versus_guest_button = document.getElementById('versus-guest-validate-button');
	
	const BoxVSPlayer = document.getElementById('BoxVSPlayer');
	const versus_player_button = document.getElementById('versus-player-validate-button');
	const VSPlayerInputs = document.getElementById('add-player-inputs').querySelectorAll('input');

	// Set initial settings
	BoxVSGuest.style.opacity = 1;
	BoxVSGuest.classList.remove('centered', 'side');
	BoxVSGuest.classList.add('centered');
	versus_guest_button.disabled = false;
	
	BoxVSPlayer.style.opacity = 0.7;
	BoxVSPlayer.classList.remove('centered', 'side');
	BoxVSPlayer.classList.add('side');
	versus_player_button.disabled = true;
	VSPlayerInputs.forEach(input => {
		input.classList.add('cursor-default');
	});
}

function initBoxs() {
	const BoxVSGuest = document.getElementById('BoxVSGuest');
	const versus_guest_button = document.getElementById('versus-guest-validate-button');
	
	const BoxVSPlayer = document.getElementById('BoxVSPlayer');
	const versus_player_button = document.getElementById('versus-player-validate-button');
	const VSPlayerInputs = document.getElementById('add-player-inputs').querySelectorAll('input');

	versus_guest_button.disabled = false;
	versus_guest_button.classList.remove('loading');

	versus_player_button.disabled = false;
	versus_player_button.classList.remove('loading');

	// Handle focus on Box VSGuest
	BoxVSGuest.addEventListener('mouseenter', () => {
		BoxVSGuest.classList.add('centered');
		BoxVSGuest.classList.remove('side');
		versus_guest_button.disabled = false;

		BoxVSPlayer.classList.add('side');
		BoxVSPlayer.classList.remove('centered');
		versus_player_button.disabled = true;
		VSPlayerInputs.forEach(input => {
			input.classList.add('cursor-default');
		});
		clearErrorFields();
	});

	// Handle focus on Box VSPlayer
	BoxVSPlayer.addEventListener('mouseenter', () => {
		BoxVSPlayer.classList.add('centered');
		BoxVSPlayer.classList.remove('side');
		versus_player_button.disabled = false;
		VSPlayerInputs.forEach(input => {
			input.classList.remove('cursor-default');
		});

		BoxVSGuest.classList.add('side');
		BoxVSGuest.classList.remove('centered');
		versus_guest_button.disabled = true;
		clearErrorFields();
	});
}

function CheckPlayer2Data() {

	const pseudo = document.getElementById('player2Pseudo').value;
	const pin = document.getElementById('player2Pin').value;
	const error_div = document.getElementById('versus-error-div');
	const error_div_text = error_div.children[0];


	if (pseudo.length === 0)
	{
		error_div_text.textContent = 'Pseudo is required.';
		error_div.style.display = 'initial';
		return false;
	}
	else if (pin.length === 0)
	{
		error_div_text.textContent = 'Pin code is required.';
		error_div.style.display = 'initial';
		return false;
	}
	else if (pin.length !== 4 || isNaN(pin))
	{
		error_div_text.textContent = 'Pin code must be 4 digits.';
		error_div.style.display = 'initial';
		return false;
	}
	return true;
}

function handle1v1FormSubmission() {
	document.getElementById('versus-match-form').addEventListener('submit', (event) => {
		event.preventDefault();

		const timeSliderValue = document.getElementById('1v1TimeSlider').value;
		const pointsSliderValue = document.getElementById('1v1PointsSlider').value;

		const max_duration = timeSliderValue === '310' ? '-1' : timeSliderValue;
		const max_score = pointsSliderValue === '12' ? '-1' : pointsSliderValue;

		if (event.submitter.id === 'versus-guest-validate-button')
		{
			const matchData = {
				game : (global_game_modal==="FLAPPYBIRD") ? "FB" : "PG",
				max_score,
				max_duration,
				tournament_id : -1,
				bot_level : -1,
			};

			document.getElementById('versus-guest-validate-button').disabled = true;
			document.getElementById('versus-guest-validate-button').classList.add('loading');

			document.getElementById('versus-player-validate-button').disabled = true;
			document.getElementById('versus-player-validate-button').classList.remove('loading');

			submit1v1Guest(matchData);
		}
		else if (event.submitter.id === 'versus-player-validate-button')
		{
			if (CheckPlayer2Data() === false)
				return ;

			const player2_username = document.getElementById('player2Pseudo').value || null;
			const player2_pin = document.getElementById('player2Pin').value || null;

			const matchData = {
				game : (global_game_modal==="FLAPPYBIRD") ? "FB" : "PG",
				player2_username,
				player2_pin,
				max_score,
				max_duration,
				tournament_id : -1,
				bot_level : -1,
			};


			document.getElementById('versus-guest-validate-button').disabled = true;
			document.getElementById('versus-guest-validate-button').classList.remove('loading');

			document.getElementById('versus-player-validate-button').disabled = true;
			document.getElementById('versus-player-validate-button').classList.add('loading');

			stop_click_on_all_page = true;

			submit1v1Player(matchData);
		}
	});
}

async function submit1v1Guest(matchData) {
	const url = "/api/matches/new/me-guest/";
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(matchData)
		});
		if (!fetched_data.ok)
		{
			throw new Error("Error while creating match.");
		}
		let data = await fetched_data.json();
		
		close_modal('modal-versus-match-creation', undefined, false);
		open_modal('modal-game', undefined, undefined, false);

		stop_click_on_all_page = false;

		document.getElementById('versus-guest-validate-button').disabled = false;
		document.getElementById('versus-guest-validate-button').classList.remove('loading');

		document.getElementById('versus-player-validate-button').disabled = false;
		document.getElementById('versus-player-validate-button').classList.remove('loading');

		const game_parameters = data["data"][0];
		if (global_game_modal === "FLAPPYBIRD")
			await start_flappybird_game(game_parameters);
		else
			await start_pong_game(game_parameters);
	}
	catch (error)
	{
		stop_click_on_all_page = false;

		document.getElementById('versus-guest-validate-button').disabled = false;
		document.getElementById('versus-guest-validate-button').classList.remove('loading');

		document.getElementById('versus-player-validate-button').disabled = false;
		document.getElementById('versus-player-validate-button').classList.remove('loading');

		create_popup("Error while creating match.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
	}
}

async function submit1v1Player(matchData) {
	const error_div = document.getElementById('versus-error-div');

	const url = "/api/matches/new/me-player/";

	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(matchData),
		});
		if (!fetched_data.ok)
		{
			stop_click_on_all_page = false;

			document.getElementById('versus-guest-validate-button').disabled = false;
			document.getElementById('versus-guest-validate-button').classList.remove('loading');

			document.getElementById('versus-player-validate-button').disabled = false;
			document.getElementById('versus-player-validate-button').classList.remove('loading');

			if (fetched_data.status === 403)
			{
				error_div.children[0].textContent = "Incorrect username or pin";
				error_div.style.display = "initial";
				return ;
			}
			else
			{
				error_div.style.display = "none";
				throw new Error("Error while creating match.");
			}
		}
		let data = await fetched_data.json();

		error_div.style.display = 'none';
		
		close_modal('modal-versus-match-creation', undefined, false);
		open_modal('modal-game', undefined, undefined, false);

		stop_click_on_all_page = false;

		document.getElementById('versus-guest-validate-button').disabled = false;
		document.getElementById('versus-guest-validate-button').classList.remove('loading');

		document.getElementById('versus-player-validate-button').disabled = false;
		document.getElementById('versus-player-validate-button').classList.remove('loading');

		const game_parameters = data["data"][0];
		if (global_game_modal === "FLAPPYBIRD")
			await start_flappybird_game(game_parameters);
		else
			await start_pong_game(game_parameters);
	}
	catch (error)
	{
		create_popup("Error while creating match.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
	}
}

function versus_match_creation_setup_display_on_game()
{
	const header = document.getElementById('versus-match-creation-menu-header-text');
	const slider_label = document.getElementById('versus-points-label');

	if (global_game_modal === "FLAPPYBIRD")
	{
		header.textContent = "CREATE A FLAPPY BIRD VERSUS";
		slider_label.textContent = "Deaths:";
	}
	else
	{
		header.textContent = "CREATE A PONG VERSUS";
		slider_label.textContent = "Points:";
		
	}
}

function initMatchVersusCreation() {

	versus_match_creation_setup_display_on_game();

	const sliderTime = document.getElementById('1v1TimeSlider');
	const sliderPoints = document.getElementById('1v1PointsSlider');

	sliderTime.value = 45;
	sliderPoints.value = 5;

	updateSlider("versus-match-form");

	clearErrorFields();
	clearInputFields();

	reset_box_display();

	modal_play.hide();
}

document.addEventListener("onModalsLoaded", function()
{
	updateSlider("versus-match-form");

	pincodeOnlyDigits('player2Pin');

	clearErrorFields();
	clearInputFields();

	initBoxs();
	reset_box_display();

	handle1v1FormSubmission();
});
