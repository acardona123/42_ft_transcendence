const g_requests = [
	{pseudo : "7", date :  7},
	{pseudo : "2", date :  2},
	{pseudo : "8", date :  8},
	{pseudo : "4", date :  4},
	{pseudo : "6", date :  6},
	{pseudo : "9", date :  9},
	{pseudo : "1", date :  1},
	{pseudo : "11", date : 11},
	{pseudo : "10", date : 10},
	{pseudo : "3", date :  3},
	{pseudo : "5", date :  5}
];

function send_friend_request(event)
{
	const input_zone = document.getElementById("add_friend_pseudo_input")
	// send JSON to the back
	// JSON.stringify({"pseudo" : input_zone.value});
	remove_friends_popup();
}

function accept_friend_req(event)
{
	const accepted_pseudo = event.target.previousSibling.textContent;

	tmp_array = ["./img/tiger.jpeg", "./img/dog.webp", "./img/flower.jpeg"];
	const is_online = Math.random() <= 0.5;
	const picture = tmp_array[Math.floor(Math.random() * tmp_array.length)];
	add_friend(accepted_pseudo, is_online, picture);
	DB_friend_list.push({pseudo: accepted_pseudo, is_online: is_online, picture: picture})
	update_friend_list();

	remove_req_sub_container_div(accepted_pseudo);
	// send to back
}

function reject_friend_req(event)
{
	const rejected_pseudo = event.target.previousSibling.previousSibling.textContent;
	remove_req_sub_container_div(rejected_pseudo);
	// send to back
}

function remove_req_sub_container_div(pseudo_to_remove)
{
	const req_container = document.getElementById("req_container");

	for (let i = 0; i < req_container.childNodes.length; i++)
	{
		if (req_container.childNodes[i].childNodes[0].textContent == pseudo_to_remove)
		{
			req_container.childNodes[i].remove();
			// DELETE on database
			// since no databse yet, do :

			for (let j = 0; j < g_requests.length; j++)
			{
				if (pseudo_to_remove == g_requests[j].pseudo)
				{
					g_requests.splice(j, 1);
					break;
				}
			}

			break ;
		}
	}
	if (req_container.childNodes.length == 0)
		update_requests_list();
}

function get_requests_pseudo()
{
	// constant array since there is no back yet
	const requests = [...g_requests];

	requests.sort((a, b) => {
		if (a.date < b.date)
			return -1;
		else
			return 1;
	});

	return requests.map(req => req.pseudo);
}

function get_req_sub_container(request_info)
{
	const req_sub_container = document.createElement('div');
	req_sub_container.className = "req-sub-container";

	const pseudo_text = document.createElement('p');
	pseudo_text.textContent = request_info;
	pseudo_text.className = "req-pseudo";

	const button_accept = document.createElement('button');
	button_accept.className = "req-accept-button btn";
	button_accept.textContent = "Accept";
	button_accept.onclick = accept_friend_req;


	const button_reject = document.createElement('button');
	button_reject.className = "req-reject-button btn";
	button_reject.textContent = "Reject";
	button_reject.onclick = reject_friend_req;

	req_sub_container.appendChild(pseudo_text);
	req_sub_container.appendChild(button_accept);
	req_sub_container.appendChild(button_reject);
	
	return req_sub_container;
}

function empty_requests_list()
{
	const requests_list = document.getElementById('req_container');
	while (requests_list.childNodes.length != 0)
	{
		requests_list.childNodes[0].remove();
	}
}

function update_requests_list(is_init)
{
	const requests_pseudo = get_requests_pseudo();
	const container = document.getElementById('req_container');
	
	if (!is_init)
		empty_requests_list();

	if (requests_pseudo.length == 0)
	{
		const empty_text = document.createElement('p');
		empty_text.textContent = "There is no friend request yet."
		empty_text.style.textAlign = "center";
		container.appendChild(empty_text);
		return;
	}
	for (let i = 0; i < requests_pseudo.length; i++)
	{
		const req_sub_container = get_req_sub_container(requests_pseudo[i]);
		container.appendChild(req_sub_container);
	}

}

update_requests_list();