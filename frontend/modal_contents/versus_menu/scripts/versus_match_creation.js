function checkSlidersMax() {
	const sliders = document.getElementById('1v1MatchForm').querySelectorAll('.slider');

	sliders.forEach((slider) => {
		slider.addEventListener('input', () => {
			handleButtonsSubmit();
		});
	});
}

function handleButtonsSubmit() {
	const VSGuestPlayButton = document.getElementById('VSGuestPlayButton');
	const VSPlayerPlayButton = document.getElementById('VSPlayerPlayButton');

	const BoxVSGuest = document.getElementById('BoxVSGuest');
	const BoxVSPlayer = document.getElementById('BoxVSPlayer');

	const sliders = Array.from(document.getElementById('1v1MatchForm').querySelectorAll('.slider'));

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

function initBoxs() {
	const BoxVSGuest = document.getElementById('BoxVSGuest');
	const VSGuestPlayButton = document.getElementById('VSGuestPlayButton');
	
	const BoxVSPlayer = document.getElementById('BoxVSPlayer');
	const VSPlayerPlayButton = document.getElementById('VSPlayerPlayButton');
	const VSPlayerInputs = document.getElementById('AddPlayerInputs').querySelectorAll('input');

	// Handle focus on Box VSGuest
	BoxVSGuest.addEventListener('click', () => {
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
		handleButtonsSubmit();
	});

	// Handle focus on Box VSPlayer
	BoxVSPlayer.addEventListener('click', () => {
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
		handleButtonsSubmit();
	});
	
	// Reset if focus is lost
	document.addEventListener('click', (e) => {
		const sliderContainers = document.getElementById('1v1MatchForm').querySelectorAll('.slider-container');

		if (!BoxVSGuest.contains(e.target) && !BoxVSPlayer.contains(e.target) && !sliderContainers[0].contains(e.target) && !sliderContainers[1].contains(e.target)){
			BoxVSGuest.classList.remove('centered', 'side');
			BoxVSPlayer.classList.remove('centered', 'side');
			VSGuestPlayButton.disabled = true;
			VSPlayerPlayButton.disabled = true;
			VSPlayerInputs.forEach(input => {
				input.classList.add('cursor-default');
			});
			clearErrorFields();
			handleButtonsSubmit();
		}
	});
	

	// Set initial settings
	BoxVSGuest.style.opacity = 0.7;
	BoxVSPlayer.style.opacity = 0.7;

	BoxVSGuest.classList.remove('centered', 'side');
	BoxVSPlayer.classList.remove('centered', 'side');
	VSGuestPlayButton.disabled = true;
	VSPlayerPlayButton.disabled = true;
	VSPlayerInputs.forEach(input => {
		input.classList.add('cursor-default');
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
	document.getElementById('1v1MatchForm').addEventListener('submit', (event) => {
		event.preventDefault();

		const timeSliderValue = document.getElementById('1v1TimeSlider').value;
		const pointsSliderValue = document.getElementById('1v1PointsSlider').value;

		const max_duration = timeSliderValue === '310' ? '-1' : timeSliderValue;
		const max_score = pointsSliderValue === '12' ? '-1' : pointsSliderValue;

		if (event.submitter.id === 'VSGuestPlayButton')
		{
			const matchData = {
				game : "PG",
				max_score,
				max_duration,
				clean_when_finished: false
			};

			sumbit1v1Guest(matchData);
		}
		else if (event.submitter.id === 'VSPlayerPlayButton')
		{
			if (CheckPlayer2Data() === false)
				return ;

			const player2_id = document.getElementById('player2Pseudo').value || null;
			const player2_pin = document.getElementById('player2Pin').value || null;

			const matchData = {
				game : "PG",
				player2_id,
				player2_pin,
				max_score,
				max_duration,
				clean_when_finished: false
			};

			sumbit1v1Player(matchData);
		}
	});
}

async function sumbit1v1Guest(matchData) {
	const errorBoxVSGuest = document.getElementById('ErrorBoxConnectionVSGuest');

	const url = "/api/matches/new/me-guest";

	console.log("fetch to /api/matches/new/me-guest");
	console.log(matchData);

	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(matchData),
		});
		if (!fetched_data.ok)
		{
			errorBoxVSGuest.textContent = 'Error connecting to server.';
			throw new Error("Error while creating match.");
		}
		let data = await fetched_data.json();
		if (!data.success)
		{
			errorBoxVSGuest.textContent = 'Invalid connection. Please try again.';
			throw new Error("Error while creating match.");
		}
		errorBoxVSGuest.textContent = '';
		errorBoxVSGuest.style.display = 'none';
		console.log("Match created.");
	}
	catch (error)
	{
		errorBoxVSGuest.style.display = 'block';
		console.log(error);
	}
}

async function sumbit1v1Player(matchData) {
	const errorBoxVSPlayer = document.getElementById('ErrorBoxConnectionVSPlayer');

	const url = "/api/matches/new/me-player";

	console.log("fetch to /api/matches/new/me-player");
	console.log(matchData);

	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(matchData),
		});
		if (!fetched_data.ok)
		{
			errorBoxVSPlayer.textContent = 'Error connecting to server.';
			throw new Error("Error while creating match.");
		}
		let data = await fetched_data.json();
		if (!data.success)
		{
			errorBoxVSPlayer.textContent = 'Invalid connection. Please try again.';
			throw new Error("Error while creating match.");
		}
		errorBoxVSPlayer.textContent = '';
		errorBoxVSPlayer.style.display = 'none';
		console.log("Match created.");
	}
	catch (error)
	{
		errorBoxVSPlayer.style.display = 'block';
		console.log(error);
	}
}

function initMatchVersusCreation() {
	modal_play.hide();

	const sliderTime = document.getElementById('1v1TimeSlider');
	const sliderPoints = document.getElementById('1v1PointsSlider');

	sliderTime.value = 45;
	sliderPoints.value = 5;

	updateSlider("1v1MatchForm");

	clearErrorFields();
	clearInputFields();
}

document.addEventListener("onModalsLoaded", function()
{
	updateSlider("1v1MatchForm");
	updateUserName();

	document.addEventListener('keydown', (event) => {
		if (event.key === "Escape") {
			close_modal('modal-versus-match-creation', return_to_modal_play);
		}
	});

	pincodeOnlyDigits();

	clearErrorFields();
	clearInputFields();

	checkSlidersMax();

	initBoxs();

	handle1v1FormSubmission();
});
