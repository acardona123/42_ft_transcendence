
function escapeKeyPressIAMatch(event) {
	if (event.key === "Escape") {
		returnToModalPlay("IAMatchCreation");
		removeEventListener('keydown', escapeKeyPressIAMatch);
	}
}

function handleIAFormSubmission() {
	document.getElementById('IAMatchForm').addEventListener('submit', (event) => {
		event.preventDefault();

		const timeSliderValue = document.getElementById('IATimeSlider').value;
		const pointsSliderValue = document.getElementById('IAPointsSlider').value;

		const max_duration = timeSliderValue === '310' ? '-1' : timeSliderValue;
		const max_score = pointsSliderValue === '12' ? '-1' : pointsSliderValue;

		const matchData = {
			game : "PG",
			max_score,
			max_duration,
			clean_when_finished: false
		};

		console.log(matchData);

		// Send match data to the backend
		fetch('/api/matches/new/me-ai', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(matchData),
		})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				alert('Match created successfully!');
			} else {
				alert('Error creating match.');
			}
		})
		.catch(() => {
			alert('Error connecting to server.');
		});
	});
}

function initMatchIACreation() {
	updateSlider("IAMatchForm");
	addEventListener('keydown', escapeKeyPressIAMatch);
	handleIAFormSubmission();
}
