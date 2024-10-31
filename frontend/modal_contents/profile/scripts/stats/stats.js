let pong_stats_info = [
	{image : "modal_contents/profile/img/pong_match_icon.png", name : "Matches", stat: undefined},
	{image : "modal_contents/profile/img/pong_winrate_icon.png", name : "Match win rate", stat: undefined},
	{image : "modal_contents/profile/img/pong_tournament_icon.png", name : "Tournaments", stat: undefined},
	{image : "modal_contents/profile/img/pong_top1_icon.png", name : "Top 1", stat: undefined},
]

let flappy_stats_info = [
	{image : "modal_contents/profile/img/flappy_match_icon.png", name : "Matches", stat: undefined},
	{image : "modal_contents/profile/img/flappy_winrate_icon.png", name : "Match win rate", stat: undefined},
	{image : "modal_contents/profile/img/flappy_tournament_icon.png", name : "Tournaments", stat: undefined},
	{image : "modal_contents/profile/img/flappy_top1_icon.png", name : "Top 1", stat: undefined}
]

function get_picture(id, is_pong)
{
	const pic = document.createElement('img');
	pic.className = "prof-stats-container-picture";
	pic.src = (is_pong ? pong_stats_info : flappy_stats_info)[id].image;
	return pic;
}

function get_stat_name(id, is_pong)
{
	const name = document.createElement('p');
	name.className = "prof-stats-container-name";
	name.textContent = (is_pong ? pong_stats_info : flappy_stats_info)[id].name;
	return name;
}

function create_stats_front(id, is_pong)
{
	const stat_text = document.createElement('p');
	stat_text.className = "prof-stats-stat-text";
	stat_text.textContent = (is_pong ? pong_stats_info : flappy_stats_info)[id].stat;
	return stat_text;
}

function update_stats_front()
{
	let elems = document.getElementById("stats_pong_div").getElementsByClassName("prof-stats-stat-text");
	for (let i = 0; i < elems.length; i++)
	{
		elems[i].textContent = pong_stats_info[i].stat;
	}

	elems = document.getElementById("stats_flappy_div").getElementsByClassName("prof-stats-stat-text");
	for (let i = 0; i < elems.length; i++)
	{
		elems[i].textContent = flappy_stats_info[i].stat;
	}
}

function update_pong_stats_data(data)
{
	pong_stats_info[0].stat = data.total_pong_matches;

	if (data.total_pong_victory == 0 || data.total_pong_matches == 0)
		pong_stats_info[1].stat = 0 + "%";
	else
		pong_stats_info[1].stat = Math.round(data.total_pong_victory / data.total_pong_matches * 100) + "%";

	pong_stats_info[2].stat = data.total_pong_tournament_played;

	if (data.total_pong_tournament_victory == 0 || data.total_pong_tournament_played == 0)
		pong_stats_info[3].stat = 0 + "%";
	else
		pong_stats_info[3].stat = Math.round(data.total_pong_tournament_victory / data.total_pong_tournament_played * 100) + "%";
}

function update_flappy_stats_data(data)
{
	flappy_stats_info[0].stat = data.total_flappy_matches;

	if (data.total_flappy_victory == 0 || data.total_flappy_matches == 0)
		flappy_stats_info[1].stat = 0 + "%";
	else
		flappy_stats_info[1].stat = Math.round(data.total_flappy_victory / data.total_flappy_matches * 100) + "%";

	flappy_stats_info[2].stat = data.total_flappy_tournament_played;

	if (data.total_flappy_tournament_victory == 0 || data.total_flappy_tournament_played == 0)
		flappy_stats_info[3].stat = 0 + "%";
	else
		flappy_stats_info[3].stat = Math.round(data.total_flappy_tournament_victory / data.total_flappy_tournament_played * 100) + "%";
}

async function update_statistics()
{
	try
	{
		const url = "/api/stats/";
		let fetched_data = await fetch_with_token(url, {
			method: 'GET',
			headers: {}
		});

		if (!fetched_data.ok)
		{
			throw new Error("Error while retrieving stats.");
		}
		let data = await fetched_data.json();
		data = data.data;
		update_pong_stats_data(data);
		update_flappy_stats_data(data);
		update_stats_front();
	}
	catch (error)
	{
		create_popup("Error while retrieving stats.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
	}
}

function build_container(container, id, is_pong)
{
	const left_div = document.createElement('div');
	left_div.className = "prof-stats-container-left";
	left_div.appendChild(get_picture(id, is_pong));
	left_div.appendChild(get_stat_name(id, is_pong));

	const right_div = document.createElement('div');
	right_div.className = "prof-stats-container-right";
	right_div.appendChild(create_stats_front(id, is_pong));

	container.appendChild(left_div);
	container.appendChild(right_div);
}

function build_all_containers()
{
	let containers = document.getElementById("stats_pong_div");
	for (let i = 0; i < containers.children.length; i++)
		build_container(containers.children[i], i, true);

	containers = document.getElementById("stats_flappy_div");
	for (let i = 0; i < containers.children.length; i++)
		build_container(containers.children[i], i, false);
}

document.addEventListener("onModalsLoaded", function()
{
	build_all_containers();
});
