const DB_history =
[
	{"game" : "Pong", "is_victory" : true, "score_left" : 10,
		"score_right" : 14, "game_duration" : 350,
		"user_against" : "alex", "date" : 1725732245789},

	{"game" : "Flappy fish", "is_victory" : false, "score_left" : 6,
		"score_right" : 1, "game_duration" : 31,
		"user_against" : "alex", "date" : 1725700000000},

	{"game" : "Pong", "is_victory" : false, "score_left" : 1,
		"score_right" : 11, "game_duration" : 184,
		"user_against" : "alex", "date" : Date.now()},

	{"game" : "Flappy fish", "is_victory" : true, "score_left" : 14,
		"score_right" : 9, "game_duration" : 5,
		"user_against" : "alex", "date" : 1725732932276},

	{"game" : "Flappy fish", "is_victory" : true, "score_left" : 14,
		"score_right" : 9, "game_duration" : 5,
		"user_against" : "alex", "date" : 1725732932276},

	{"game" : "Flappy fish", "is_victory" : true, "score_left" : 14,
		"score_right" : 9, "game_duration" : 5,
		"user_against" : "alex", "date" : 1725732932276},

	{"game" : "Flappy fish", "is_victory" : true, "score_left" : 14,
		"score_right" : 9, "game_duration" : 5,
		"user_against" : "alex", "date" : 1725732932276}
];

function get_history_from_DB()
{
	let history_list = [...DB_history];
	history_list.sort((a, b) => {
		if (a.date < b.date)
			return -1;
		return 1;
	});
	return history_list;
}

function get_victory(is_victory)
{
	const text_victory = document.createElement('p');
	text_victory.textContent = is_victory ? "Victory" : "Defeat";
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


function get_history_elem_div(history_elem)
{
	const history_elem_div = document.createElement("div");

	history_elem_div.className = "history-elem-div";
	if (history_elem.game == "Pong")
		history_elem_div.style.backgroundImage = history_elem.is_victory ? "url(../../../img/pong_background_history_img_win.png)" : "url(../../../img/pong_background_history_img_loose.png)";
	else if (history_elem.game == "Flappy fish")
		history_elem_div.style.backgroundImage = history_elem.is_victory ? "url(../../../img/flappy_background_history_win.png)" : "url(../../../img/flappy_background_history_loose.png)";

	const text_victory = get_victory(history_elem.is_victory);
	const text_score = get_score(history_elem.score_left, history_elem.score_right, history_elem.user_against);
	const text_date_time = get_date_time(history_elem.date, history_elem.game_duration);
	
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


let date_now;
const history_list = get_history_from_DB(DB_history);

function update_history_list(tab)
{
	date_now = Date.now();
	for (let i = 0; i < history_list.length; i++)
	{
		if (tab.type == history_list[i].game)
			add_element_to_history(history_list[i], i);
	}

	const _history_list = document.getElementById("history_list");
	if (_history_list.childNodes.length == 0) // display message if the history is empty
	{
		const no_history_message = document.createElement('p');
		no_history_message.textContent = "There is no history to display yet."
		no_history_message.style.textAlign = "center";
		_history_list.appendChild(no_history_message);
	}
	else // remove last element margin bottom
	{
		_history_list.childNodes[_history_list.childNodes.length - 1].style.marginBottom = "0px";
	}
}
