let tournament_id = undefined;

async function send_tournament_next_match_request(){
	const url = "https://localhost:8443/api/tournaments/match/start/";
	const body_content = {"tournament_id": tournament_id};
	let fetched_data = await fetch_with_token(url, {
		method: 'POST',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify(body_content)
	});
	return (fetched_data);
}	