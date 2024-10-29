function handleIAFormSubmission() {
	document.getElementById('IAMatchForm').addEventListener('submit', (event) => {
		submitIAForm(event);
	});
}

async function submitIAForm(event) {
	event.preventDefault();

	const timeSliderValue = document.getElementById('IATimeSlider').value;
	const pointsSliderValue = document.getElementById('IAPointsSlider').value;

	const max_duration = timeSliderValue === '310' ? '-1' : timeSliderValue;
	const max_score = pointsSliderValue === '12' ? '-1' : pointsSliderValue;

	const body = {
		game: "PG",
		max_score,
		max_duration,
		tournament_id : -1,
		bot_level : 1,
		// bot_level : 1,
	};
	
	console.log(body);

	const url = "/api/matches/new/me-ai/";

	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(body),
		});
		if (!fetched_data.ok)
		{
			create_popup("Error while creating match.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
			throw new Error("Error while creating match.");
		}

		let data = await fetched_data.json();

		close_modal('modal-ia-match-creation', undefined, false);
		open_modal('modal-game', undefined, undefined, false);

		start_pong_game(data, body.bot_level);
	}
	catch (error)
	{
		console.log(error);
	}
}


function initMatchIACreation() {
	const sliderTime = document.getElementById('IATimeSlider');
	const sliderPoints = document.getElementById('IAPointsSlider');
	
	sliderTime.value = 45;
	sliderPoints.value = 5;
	
	updateSlider("IAMatchForm");

	modal_play.hide();
}

document.addEventListener("onModalsLoaded", () => {
	initMatchIACreation();

	// document.addEventListener('keydown', (event) => {
	// 	if (event.key === "Escape") {
	// 		close_modal('modal-ia-match-creation', return_to_modal_play);
	// 	}
	// });

	handleIAFormSubmission();
});
