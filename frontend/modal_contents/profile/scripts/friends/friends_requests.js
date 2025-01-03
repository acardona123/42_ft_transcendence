function send_request(data, status)
{
	if (status == "201")
	{
		create_popup("Waiting for " + data.friend_request.username + " to accept.",
			4000, 4000,
			hex_color=HEX_GREEN, t_hover_color=HEX_GREEN_HOVER);
	}
	else
	{
		create_popup("You already sent a request to " + data.friend_request.username + ".",
			4000, 4000,
			hex_color=HEX_GREEN, t_hover_color=HEX_GREEN_HOVER);
	}
}

function remove_request_from_data(username_to_remove)
{
	data_requests.splice(data_requests.findIndex(o => o.username === username_to_remove), 1);
}

function send_request_lead_to_friendship(data, status)
{
	// add friendship
	const id_to_remove = data.remove_friend_request;
	const username_to_remove = data_requests.find(o => o.id === id_to_remove)?.username;
	const request_container = document.getElementById("req_container");
	for (let i = 0; i < request_container.children.length; i++)
	{
		if (username_to_remove === undefined)
			break ;
		if (request_container.children[i].children[0].textContent == username_to_remove)
		{
			request_container.children[i].remove();
			remove_request_from_data(username_to_remove);
			update_requests_list_front();
			break;
		}
	}
	// in case of 200 status response, which should not happen, don't create
	// friendship as it already exists
	if (status == "201")
	{
		add_friend_array({
			id: data.friendship.id,
			username: data.friendship.username,
			online_status: data.friendship.status,
			profile_picture: data.friendship.profile_picture
		});
		update_friend_list_front();
		create_popup("You're now friend with " + data.friendship.username + "!",
			4000, 4000,
			hex_color=HEX_GREEN, t_hover_color=HEX_GREEN_HOVER);
	}
}

async function send_friend_request()
{
	const input_zone = document.getElementById("add_friend_pseudo_input");
	const url = "/api/friends/request/send/";
	if (input_zone.value.length == 0)
		return ;
	const body = JSON.stringify({name: input_zone.value});
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: body
		});
		if (!fetched_data.ok)
		{
			if (fetched_data.status != 400)
				throw "Friend request failed.";
			let data = await fetched_data.json();
			if (data.message == "Invalid username")
				throw "Invalid username.";
			else if (data.message == 'Friendship already exists')
				throw "Friendship already exists.";
			else if (data.message == 'Can\'t send friend request to yourself')
				throw "Can\'t send friend request to yourself.";
			else
				throw "Friend request failed.";
		}
		let data = await fetched_data.json();
		data = data.data;
		if (data.hasOwnProperty('remove_friend_request'))
			send_request_lead_to_friendship(data, fetched_data.status);
		else
			send_request(data, fetched_data.status);
	}
	catch (error)
	{
		create_popup(error,
			4000, 4000,
			hex_color=HEX_RED, t_hover_color=HEX_RED_HOVER);
	}
	remove_friends_popup();
}

function remove_friend_request_front(elem, data, id, pseudo)
{
	let id_to_remove_back;
	if (data.hasOwnProperty('remove_friend_request'))
		id_to_remove_back = data.remove_friend_request;
	else
		id_to_remove_back = data.friend_request;
	const elem_parent_list = elem.parentNode.parentNode;
	if (id != id_to_remove_back)
	{
		// kind of heavy to perform but it should not happen in a normal back communication
		let new_pseudo_to_remove = data_requests.find(o => o.id === id_to_remove_back).username;
		let children = elem.parentNode.parentNode.children;
		for (let i = 0; i < children.length; i++)
		{
			if (children[i].children[0].textContent == new_pseudo_to_remove)
			{
				children[i].remove();
				remove_request_from_data(new_pseudo_to_remove);
				break;
			}
		}
	}
	else // normal back communication case
	{
		elem.parentNode.remove();
		remove_request_from_data(pseudo);
	}
	if (elem_parent_list.children.length == 0)
		update_requests_list_front();
}

async function accept_friend_req(event)
{
	const accepted_pseudo = event.target.previousSibling.textContent;
	const accepted_id = data_requests.find(o => o.username === accepted_pseudo)?.id;
	const url = "/api/friends/request/" + accepted_id + "/";

	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: {}
		});
		if (!fetched_data.ok)
			throw new Error(`${fetched_data.status}`);
		let data = await fetched_data.json();
		data = data.data;
		if (fetched_data.status == 201) // the friendship did not exist
		{
			add_friend_array({
				id: data.friendship.id,
				username: data.friendship.username,
				online_status: data.friendship.status,
				profile_picture: data.friendship.profile_picture
			});
			update_friend_list_front();
		}
		remove_friend_request_front(event.target, data, accepted_id, accepted_pseudo);
	}
	catch (error)
	{
		create_popup("Accepting request failed.",
			4000, 4000,
			hex_color=HEX_RED, t_hover_color=HEX_RED_HOVER);
	}
}


async function reject_friend_req(event)
{
	const rejected_pseudo = event.target.parentNode.children[0].textContent;
	const rejected_id = data_requests.find(o => o.username === rejected_pseudo)?.id;
	const url = "/api/friends/request/" + rejected_id + "/";

	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'DELETE',
			headers: {}
		});
		if (!fetched_data.ok)
			throw new Error(`Response status: ${fetched_data.status}`);
		let data = await fetched_data.json();
		data = data.data;
		remove_friend_request_front(event.target, data, rejected_id, rejected_pseudo);
	}
	catch (error)
	{
		create_popup("Rejecting request failed.",
			4000, 4000,
			hex_color=HEX_RED, t_hover_color=HEX_RED_HOVER);
	}
}

function get_requests_pseudo()
{
	if (data_requests == undefined)
		return undefined;
	const requests = [...data_requests];
	return requests.map(req => req.username);
}

function get_req_sub_container(request_info)
{
	const req_sub_container = document.createElement('div');
	req_sub_container.className = "prof-req-sub-container";

	const pseudo_text = document.createElement('p');
	pseudo_text.textContent = request_info;
	pseudo_text.className = "prof-req-pseudo";

	const button_accept = document.createElement('button');
	button_accept.tabIndex = "0";
	button_accept.className = "prof-req-accept-button btn";
	button_accept.textContent = "Accept";
	button_accept.onclick = accept_friend_req;


	const button_reject = document.createElement('button');
	button_reject.className = "prof-req-reject-button btn";
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

function update_requests_list_front()
{
	const requests_pseudo = get_requests_pseudo();
	const container = document.getElementById('req_container');
	
	empty_requests_list();
	if (requests_pseudo == undefined || requests_pseudo.length == 0)
	{
		const empty_text = document.createElement('p');
		empty_text.textContent = "There is no friend request yet.";
		empty_text.style.textAlign = "center";
		empty_text.style.color = "var(--lavender)";
		container.appendChild(empty_text);
		return;
	}
	for (let i = 0; i < requests_pseudo.length; i++)
	{
		const req_sub_container = get_req_sub_container(requests_pseudo[i]);
		container.appendChild(req_sub_container);
	}
}

async function get_data_from_database()
{
	const url = "/api/friends/request/";
	try {
		let fetched_data = await fetch_with_token(url, {
			method: 'GET',
			headers: {}
		});
		if (!fetched_data.ok)
			throw new Error(`${fetched_data.status}`);
		let data = await fetched_data.json();
		return data.data;
	}
	catch (error)
	{
		create_popup("Retrieving friend requests failed.",
			4000, 4000,
			hex_color=HEX_RED, t_hover_color=HEX_RED_HOVER);
	}
	return undefined;
}

let data_requests = undefined;

async function setup_friends_request_list()
{
	data_requests = await get_data_from_database();
	update_requests_list_front();
}
