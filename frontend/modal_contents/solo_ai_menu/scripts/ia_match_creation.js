function handleIAFormSubmission() {
	document.getElementById('IAMatchForm').addEventListener('submit', (event) => {
		sumbitIAForm(event);
	});
}

async function sumbitIAForm(event) {
	event.preventDefault();

	const timeSliderValue = document.getElementById('IATimeSlider').value;
	const pointsSliderValue = document.getElementById('IAPointsSlider').value;

	const max_duration = timeSliderValue === '310' ? '-1' : timeSliderValue;
	const max_score = pointsSliderValue === '12' ? '-1' : pointsSliderValue;

	const body = {
		game: "PG",
		max_score,
		max_duration,
		clean_when_finished: false
	};
	
	console.log(body);

	const url = "/api/matches/new/me-ai";

	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(body),
		});
		if (!fetched_data.ok)
			throw new Error("Error while creating match.");
		let data = await fetched_data.json();
		if (!data.success)
			throw new Error("Error while creating match.");
		console.log("Match created.");
	}
	catch (error)
	{
		console.log(error);
	}
}

function initMatchIACreation() {
	modal_play.hide();

	const sliderTime = document.getElementById('IATimeSlider');
	const sliderPoints = document.getElementById('IAPointsSlider');

	sliderTime.value = 45;
	sliderPoints.value = 5;

	updateSlider("IAMatchForm");
}

document.addEventListener("onModalsLoaded", () => {
	initMatchIACreation();
	updateSlider("IAMatchForm");

	document.addEventListener('keydown', (event) => {
		if (event.key === "Escape") {
			close_modal('modal-ia-match-creation', return_to_modal_play);
		}
	});

	handleIAFormSubmission();
});
