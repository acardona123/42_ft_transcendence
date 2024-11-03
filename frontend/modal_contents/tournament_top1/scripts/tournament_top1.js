function tournament_top1_loading_elements()
{
	const div_winner = document.getElementById("tt1-text-win");
	div_winner.children[0].style.display = "none";
	div_winner.children[1].textContent = "Loading top1...";
}

async function get_top1()
{
	const url = `/api/tournaments/round/?tournament_id=${tournament_id}`;
	try
	{
		let data_fetched = await fetch_with_token(url, {
			method: 'GET',
			headers: {}
		});
		if (!data_fetched.ok)
			throw new Error(`${body.get("message", "internal error")}`);
		let body = await data_fetched.json();
		return body.data.matches;
	}
	catch (error)
	{
		alert("Failed to display the tournament winner but it is the winner of the last match that have been played, congratulations !")
		close_modal("modal-tournament-top1", undefined, false);
		return undefined;
	}
}

function update_top1(top1)
{
	if (top1 === undefined)
		return;
	let div_winner = document.getElementById("tt1-text-win");
	div_winner.children[0].style.display = "inline";
	div_winner.children[1].textContent = top1;
}
