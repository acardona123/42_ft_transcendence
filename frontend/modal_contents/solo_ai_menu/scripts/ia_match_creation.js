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
	};

	document.getElementById('ia_validate_button').disabled = true;
	document.getElementById('ia_validate_button').classList.add('loading');

	stop_click_on_all_page = true;

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
			throw new Error("Error while creating match.");
		}

		let data = await fetched_data.json();

		close_modal('modal-ia-match-creation', undefined, true);
		open_modal('modal-game', undefined, undefined, false);

		stop_click_on_all_page = false;

		document.getElementById('ia_validate_button').disabled = false;
		document.getElementById('ia_validate_button').classList.remove('loading');

		const game_parameters = data["data"][0];
		await start_pong_game(game_parameters, body.bot_level);
	}
	catch (error)
	{
		stop_click_on_all_page = false;

		document.getElementById('ia_validate_button').disabled = false;
		document.getElementById('ia_validate_button').classList.remove('loading');

		create_popup("Error while creating match. Try again.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
		alert("Error while creating match, feel free to retry or exit the window.")
	}
}


function initMatchIACreation() {
	const sliderTime = document.getElementById('IATimeSlider');
	const sliderPoints = document.getElementById('IAPointsSlider');
	
	sliderTime.value = 45;
	sliderPoints.value = 5;
	
	updateSlider("IAMatchForm");

	document.getElementById('ia_validate_button').disabled = false;
	document.getElementById('ia_validate_button').classList.remove('loading');

	modal_play.hide();
}

document.addEventListener("onModalsLoaded", () => {
	initMatchIACreation();
	handleIAFormSubmission();
});
