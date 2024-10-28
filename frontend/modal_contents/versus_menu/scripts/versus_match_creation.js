function disable_buttons_versus_form() {
	const VSGuestPlayButton = document.getElementById('VSGuestPlayButton');
	const VSPlayerPlayButton = document.getElementById('VSPlayerPlayButton');

	const BoxVSGuest = document.getElementById('BoxVSGuest');
	const BoxVSPlayer = document.getElementById('BoxVSPlayer');

	const sliders = Array.from(document.getElementById('versus-match-form').querySelectorAll('.slider'));

	const countMaxValues = sliders.filter(slider => slider.value === slider.max).length;

	if (countMaxValues > 1)
	{
		VSGuestPlayButton.disabled = true;
		VSPlayerPlayButton.disabled = true;
	}
	else
	{
		if (BoxVSGuest.classList.contains('centered', 'side'))
			VSGuestPlayButton.disabled = false;
		else if (BoxVSPlayer.classList.contains('centered', 'side'))
			VSPlayerPlayButton.disabled = false;
	}
}

function reset_box_display()
{
	const BoxVSGuest = document.getElementById('BoxVSGuest');
	const VSGuestPlayButton = document.getElementById('VSGuestPlayButton');
	
	const BoxVSPlayer = document.getElementById('BoxVSPlayer');
	const VSPlayerPlayButton = document.getElementById('VSPlayerPlayButton');
	const VSPlayerInputs = document.getElementById('add-player-inputs').querySelectorAll('input');

	// Set initial settings
	BoxVSGuest.style.opacity = 1;
	BoxVSGuest.classList.remove('centered', 'side');
	BoxVSGuest.classList.add('centered');
	VSGuestPlayButton.disabled = false;
	
	BoxVSPlayer.style.opacity = 0.7;
	BoxVSPlayer.classList.remove('centered', 'side');
	BoxVSPlayer.classList.add('side');
	VSPlayerPlayButton.disabled = true;
	VSPlayerInputs.forEach(input => {
		input.classList.add('cursor-default');
	});
}

function initBoxs() {
	const BoxVSGuest = document.getElementById('BoxVSGuest');
	const VSGuestPlayButton = document.getElementById('VSGuestPlayButton');
	
	const BoxVSPlayer = document.getElementById('BoxVSPlayer');
	const VSPlayerPlayButton = document.getElementById('VSPlayerPlayButton');
	const VSPlayerInputs = document.getElementById('add-player-inputs').querySelectorAll('input');

	// Handle focus on Box VSGuest
	BoxVSGuest.addEventListener('mouseenter', () => {
		BoxVSGuest.classList.add('centered');
		BoxVSGuest.classList.remove('side');
		VSGuestPlayButton.disabled = false;

		BoxVSPlayer.classList.add('side');
		BoxVSPlayer.classList.remove('centered');
		VSPlayerPlayButton.disabled = true;
		VSPlayerInputs.forEach(input => {
			input.classList.add('cursor-default');
		});
		clearErrorFields();
	});

	// Handle focus on Box VSPlayer
	BoxVSPlayer.addEventListener('mouseenter', () => {
		BoxVSPlayer.classList.add('centered');
		BoxVSPlayer.classList.remove('side');
		VSPlayerPlayButton.disabled = false;
		VSPlayerInputs.forEach(input => {
			input.classList.remove('cursor-default');
		});

		BoxVSGuest.classList.add('side');
		BoxVSGuest.classList.remove('centered');
		VSGuestPlayButton.disabled = true;
		clearErrorFields();
	});
}

function CheckPlayer2Data() {

	const pseudo = document.getElementById('player2Pseudo').value;
	const pin = document.getElementById('player2Pin').value;
	const errorBox = document.getElementById('ErrorBoxConnectionVSPlayer');


	if (pseudo.length === 0)
	{
		errorBox.textContent = 'Pseudo is required.';
		errorBox.style.display = 'block';
		return false;
	}
	else if (pin.length === 0)
	{
		errorBox.textContent = 'Pin code is required.';
		errorBox.style.display = 'block';
		return false;
	}
	else if (pin.length !== 4 || isNaN(pin))
	{
		errorBox.textContent = 'Pin code must be 4 digits.';
		errorBox.style.display = 'block';
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

		if (event.submitter.id === 'VSGuestPlayButton')
		{
			const matchData = {
				game : (global_game_modal==="FLAPPYBIRD") ? "FB" : "PG",
				max_score,
				max_duration,
				tournament_id : -1,
				bot_level : -1,
			};

			submit1v1Guest(matchData);
		}
		else if (event.submitter.id === 'VSPlayerPlayButton')
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

			submit1v1Player(matchData);
		}
	});
}

async function submit1v1Guest(matchData) {
	const errorBoxVSGuest = document.getElementById('ErrorBoxConnectionVSGuest');

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
			console.log(await fetched_data.json());//
			errorBoxVSGuest.textContent = 'Error connecting to server.';
			errorBoxVSGuest.style.display = 'block';
			throw new Error("Error while creating match.");
		}
		let data = await fetched_data.json();

		errorBoxVSGuest.textContent = '';
		errorBoxVSGuest.style.display = 'none';
		
		close_modal('modal-versus-match-creation', undefined, false);
		open_modal('modal-game', undefined, undefined, false);

		if (global_game_modal === "FLAPPYBIRD")
			start_flappybird_game(data);
		else
			start_pong_game(data);
	}
	catch (error)
	{
		errorBoxVSGuest.style.display = 'block';
		console.log(error);
	}
}

async function submit1v1Player(matchData) {
	const errorBoxVSPlayer = document.getElementById('ErrorBoxConnectionVSPlayer');

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
			console.log(await fetched_data.json());//
			errorBoxVSPlayer.textContent = 'Error connecting to server.';
			throw new Error("Error while creating match.");
		}
		let data = await fetched_data.json();

		errorBoxVSPlayer.textContent = '';
		errorBoxVSPlayer.style.display = 'none';
		
		close_modal('modal-versus-match-creation', undefined, false);
		open_modal('modal-game', undefined, undefined, false);

		if (global_game_modal === "FLAPPYBIRD")
			start_flappybird_game(data);
		else
			start_pong_game(data);
	}
	catch (error)
	{
		errorBoxVSPlayer.style.display = 'block';
		console.log(error);
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

	// document.addEventListener('keydown', (event) => {
	// 	if (event.key === "Escape") {
	// 		close_modal('modal-versus-match-creation', return_to_modal_play);
	// 	}
	// });

	pincodeOnlyDigits('player2Pin');

	clearErrorFields();
	clearInputFields();

	initBoxs();
	reset_box_display();

	handle1v1FormSubmission();
});
