let date_now;

function convert_dates(matches)
{
	matches.forEach(match => {
		match.date =  Date.parse(match.date);
	});
}

async function get_history_from_DB()
{
	const url = "https://localhost:8443/api/matches/";
	
	try
	{
		let data_fetched = await fetch(url);
		if (!data_fetched.ok)
			throw new Error(`${data_fetched.status}`);
		let data = await data_fetched.json();
		convert_dates(data.matches);
		return data.matches;
	}
	catch (error)
	{
		create_popup("Retrieving history failed.",
			2000, 4000,
			hex_color="#FF000080", t_hover_color="#FF0000C0");
	}
	return undefined;

}

function get_victory(victory)
{
	const text_victory = document.createElement('p');
	if (victory == "victory")
		text_victory.textContent = "Victory";
	else if (victory == "defeat")
		text_victory.textContent = "Defeat";
	else
		text_victory.textContent = "Tie";
	text_victory.className = "text-victory";
	return text_victory;
}

function get_score(score_left, score_right, user_against)
{
	const score = document.createElement('div');
	score.className = "score-div"

	const span_left = document.createElement('span');
	span_left.className = "score-left";
	span_left.textContent = "You - " + format(score_left.toString());
	score.appendChild(span_left);

	const mid_text = document.createElement('p');
	mid_text.textContent = " | ";
	mid_text.className = "score-mid";

	score.appendChild(mid_text);
	
	const span_right = document.createElement('span');
	span_right.className = "score-right";
	span_right.textContent = format(score_right.toString())
							+ " - " + user_against;

	score.appendChild(span_right);
	return score;
}

function get_date_since_now(epoch_history)
{
	var time_since = Math.round((date_now - epoch_history) / 1000);

	if (time_since < 1) // less than 1s
		return "Less than a second ago";
	if (time_since < 60) // less than a minute
	{
		var tmp = Math.round(time_since);
		return tmp + " second" + (tmp != 1 ? "s" : "") + " ago";
	}
	if (time_since < (60 * 60)) // less than an hour
	{
		var tmp = Math.round(time_since / 60);
		return tmp + " minute" + (tmp != 1 ? "s" : "") + " ago";
	}
	if (time_since < (60 * 60 * 24))
	{
		var tmp = Math.round(time_since / (60 * 60));
		return tmp + " hour" + (tmp != 1 ? "s" : "") + " ago";
	}
	if (time_since < (60 * 60 * 24 * 31))
	{
		var tmp = Math.round(time_since /(60 * 60 * 24));
		return tmp + " day" + (tmp != 1 ? "s" : "") + " ago";
	}
	if (time_since < (60 * 60 * 24 * 31 * 12))
	{
		var tmp = Math.round(time_since / (60 * 60 * 24 * 31));
		return tmp + " month" + (tmp != 1 ? "s" : "") + " ago";
	}
	else
	{
		var tmp = Math.round(time_since /(60 * 60 * 24 * 31 * 12));
		return tmp + " year" + (tmp != 1 ? "s" : "") + " ago";
	}
}

function format(digits)
{
	if (digits.length == 1)
		return "0" + digits;
	return digits;
}

function get_date(epoch_history)
{
	let date = new Date(epoch_history);

	return		format(date.getHours().toString()) + ":" +
				format(date.getMinutes().toString()) + ":" +
				format(date.getSeconds().toString()) + " " +
				format(date.getDate().toString()) + "/" +
				format(date.getMonth().toString()) + "/" +
				format(date.getFullYear().toString());
}

function hover_date_since_enter(event)
{
	const elem = event.currentTarget;
	const id = parseInt(elem.parentNode.parentNode.id);
	elem.textContent = get_date(history_list[id].date);
}

function hover_date_since_leave(event)
{
	const elem = event.currentTarget;
	const id = parseInt(elem.parentNode.parentNode.id);
	elem.textContent = get_date_since_now(history_list[id].date);
}

function convert_sec_to_duration(duration_in_sec)
{
	let minutes = 0;
	let res = "";

	minutes = Math.floor(duration_in_sec / 60);
	if (minutes != 0)
	{
		res = format(minutes.toString());
		res += "min ";
		res += format((duration_in_sec % 60).toString());
		res += "s";
	}
	else
	{
		res += (duration_in_sec % 60).toString();
		res += "s";
	}
	return res;
}

function get_date_time(elem_date, game_duration)
{
	const text_date_time = document.createElement('div');
	text_date_time.className = "date-duration-div";

	const date = document.createElement('div');
	date.textContent = get_date_since_now(elem_date);
	date.className = "date-text";
	date.onmouseenter = hover_date_since_enter;
	date.onmouseleave = hover_date_since_leave;

	const time = document.createElement('p');
	time.textContent = convert_sec_to_duration(game_duration);
	time.className = "time-text";
	text_date_time.appendChild(date);
	text_date_time.appendChild(time);
	return text_date_time;
}

function get_victory_state(main_player_score, opponent_score)
{
	if (main_player_score > opponent_score)
		return "victory";
	else if (main_player_score == opponent_score)
		return "tie";
	return "defeat";
}

function get_history_elem_div(history_elem)
{
	const history_elem_div = document.createElement("div");
	let victory_state = get_victory_state(history_elem.main_player_score, history_elem.opponent_score);

	history_elem_div.className = "history-elem-div";
	if (history_elem.game == "PG")
	{
		if (victory_state == "victory")
			history_elem_div.style.backgroundImage = "url(../../../img/pong_background_history_img_win.png)";
		else if (victory_state == "defeat")
			history_elem_div.style.backgroundImage = "url(../../../img/pong_background_history_img_loose.png)";
		else
			history_elem_div.style.backgroundImage = "url(../../../img/pong_background_history_img_tie.png)";
	}
	else if (history_elem.game == "FB")
	{
		if (victory_state == "victory")
			history_elem_div.style.backgroundImage = "url(../../../img/flappy_background_history_win.png)";
		else if (victory_state == "defeat")
			history_elem_div.style.backgroundImage = "url(../../../img/flappy_background_history_loose.png)";
		else
			history_elem_div.style.backgroundImage = "url(../../../img/flappy_background_history_tie.png)";
	}
	const text_victory = get_victory(victory_state);
	const text_score = get_score(history_elem.main_player_score, history_elem.opponent_score, history_elem.opponent_username);
	const text_date_time = get_date_time(history_elem.date, history_elem.duration);
	
	history_elem_div.appendChild(text_victory);
	history_elem_div.appendChild(text_score);
	history_elem_div.appendChild(text_date_time);
	return history_elem_div;
}

function add_element_to_history(history_elem, id)
{
	const _history_list = document.getElementById("history_list");
	const history_elem_div = get_history_elem_div(history_elem);
	history_elem_div.id = id.toString();
	_history_list.appendChild(history_elem_div);
}

function update_history_list(tab_name)
{
	if (history_list != undefined)
	{
		date_now = Date.now();
		for (let i = 0; i < history_list.length; i++)
		{
			if (tab_name == "Pong" && history_list[i].game == "PG")
				add_element_to_history(history_list[i], i);
			else if (tab_name == "Flappy fish" && history_list[i].game == "FB")
				add_element_to_history(history_list[i], i);
		}
	}
			
	const _history_list = document.getElementById("history_list");
	if (_history_list.childNodes.length == 0 || history_list == undefined) // display message if the history is empty
	{
		const no_history_message = document.createElement('p');
		no_history_message.textContent = "There is no history to display yet."
		no_history_message.style.textAlign = "center";
		no_history_message.style.marginTop = "10px";
		_history_list.appendChild(no_history_message);
	}
	else // remove last element margin bottom
	{
		_history_list.childNodes[_history_list.childNodes.length - 1].style.marginBottom = "0px";
	}
}

let history_list;

(async () => 
{
	history_list = await get_history_from_DB();
	// set click on first tab by default
	on_click_tab_history(document.getElementsByClassName("tab-text")[0]);
})()