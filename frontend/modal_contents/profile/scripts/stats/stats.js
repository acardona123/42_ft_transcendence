const pong_stats_info = [
	{image : "../../../img/pong_match_icon.png", name : "Matches played"},
	{image : "../../../img/pong_winrate_icon.png", name : "Match win rate"},
	{image : "../../../img/pong_tournament_icon.png", name : "Tournaments"},
	{image : "../../../img/pong_top1_icon.png", name : "Top 1"},
]

const flappy_stats_info = [
	{image : "../../../img/flappy_match_icon.png", name : "Matches"},
	{image : "../../../img/flappy_winrate_icon.png", name : "Match win rate"},
	{image : "../../../img/flappy_tournament_icon.png", name : "Tournaments played"},
	{image : "../../../img/flappy_top1_icon.png", name : "Top 1"}
]

function get_picture(id, is_pong)
{
	const pic = document.createElement('img');
	pic.className = "stats-container-picture";
	pic.src = (is_pong ? pong_stats_info : flappy_stats_info)[id].image;
	return pic;
}

function get_stat_name(id, is_pong)
{
	const name = document.createElement('p');
	name.className = "stats-container-name";
	name.textContent = (is_pong ? pong_stats_info : flappy_stats_info)[id].name;
	return name;
}

function get_right_statistique()
{
	// since there is no back yet
	const stat_text = document.createElement('p');
	stat_text.className = "stats-stat-text";
	stat_text.textContent = "41%";
	return stat_text;
}

function build_container(container, id, is_pong)
{
	const left_div = document.createElement('div');
	left_div.className = "stats-container-left";
	left_div.appendChild(get_picture(id, is_pong));
	left_div.appendChild(get_stat_name(id, is_pong));

	const right_div = document.createElement('div');
	right_div.className = "stats-container-right";
	right_div.appendChild(get_right_statistique());

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
