
function escapeKeyPress1v1Match(event) {
	if (event.key === "Escape") {
		returnToModalPlay("1v1MatchCreation");
		removeEventListener('keydown', escapeKeyPress1v1Match);
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
	});
	
	// Reset if focus is lost
	document.addEventListener('click', (e) => {
		if (!BoxVSGuest.contains(e.target) && !BoxVSPlayer.contains(e.target)) {
			BoxVSGuest.classList.remove('centered', 'side');
			BoxVSPlayer.classList.remove('centered', 'side');
			VSGuestPlayButton.disabled = true;
			VSPlayerPlayButton.disabled = true;
			VSPlayerInputs.forEach(input => {
				input.classList.add('cursor-default');
			});
			clearErrorFields();
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

function CheckConnectionPlayer2() {

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
	// else
	// {
	// 	console.log("fetch to /validate-player2");
	// 	console.log({ pseudo, pin });

		
	// 	// Simulate backend request for player 2 validation
	// 	fetch('/validate-player2', {
	// 		method: 'POST',
	// 		headers: { 'Content-Type': 'application/json' },
	// 		body: JSON.stringify({ pseudo, pin })
	// 	})
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		if (data.success) {
	// 			alert('Player 2 connected successfully!');
	// 			errorBox.textContent = '';
	// 			errorBox.style.display = 'none';

	// 			player2IsConnected = true;
	
	// 		} else {
	// 			errorBox.textContent = 'Invalid connection. Please try again.';
	// 			errorBox.style.display = 'block';
	// 		}
	// 	})
	// 	.catch(() => {

	// 	});
	// 	console.log("player2IsConnected = " + player2IsConnected);
	// }
	return true;
}

function handle1v1FormSubmission() {
	document.getElementById('1v1MatchForm').addEventListener('submit', (event) => {
		event.preventDefault();

		const errorBoxVSGuest = document.getElementById('ErrorBoxConnectionVSGuest');
		const errorBoxVSPlayer = document.getElementById('ErrorBoxConnectionVSPlayer');

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

			console.log("fetch to /api/matches/new/me-guest");
			console.log(matchData);
	
			// Send match data to the backend
			fetch('/api/matches/new/me-guest', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(matchData),
			})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					errorBoxVSGuest.textContent = '';
					errorBoxVSGuest.style.display = 'none';
				} else {
					errorBoxVSGuest.textContent = 'Invalid connection. Please try again.';
					errorBoxVSGuest.style.display = 'block';
				}
			})
			.catch(() => {
				errorBoxVSGuest.textContent = 'Error connecting to server.';
				errorBoxVSGuest.style.display = 'block';
			});
		}
		else if (event.submitter.id === 'VSPlayerPlayButton')
		{
			if (CheckConnectionPlayer2() === false)
				return;

			// game player2_id, player2_pin, max_score, max_duration, clean_when_finished

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

			console.log("fetch to /api/matches/new/me-player");
			console.log(matchData);

			// Send match data to the backend
			fetch('/api/matches/new/me-player', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(matchData),
			})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					errorBoxVSPlayer.textContent = '';
					errorBoxVSPlayer.style.display = 'none';
				} else {
					errorBoxVSPlayer.textContent = 'Error creating match.';
					errorBoxVSPlayer.style.display = 'block';
				}
			})
			.catch(() => {
				errorBoxVSPlayer.textContent = 'Error connecting to server.';
				errorBoxVSPlayer.style.display = 'block';
			});
		}
	});
}

let player2IsConnected = false;

function initMatch1v1Creation() {
	updateSlider("1v1MatchForm");
	updateUserName();

	addEventListener('keydown', escapeKeyPress1v1Match);
	pincodeOnlyDigits();

	clearErrorFields();
	clearInputFields();
	addFocusOutListener();

	initBoxs();

	handle1v1FormSubmission();

}
