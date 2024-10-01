function send_request(data, status)
{
	if (status == "201")
	{
		create_popup("Waiting for " + data.friend_request.username + " to accept.",
			2000, 4000,
			hex_color="#00FF0080", t_hover_color="#00FF00C0");
	}
	else
	{
		create_popup("You already sent a request to " + data.friend_request.username + ".",
			2000, 4000,
			hex_color="#00FF0080", t_hover_color="#00FF00C0");
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
	const username_to_remove = data_requests.find(o => o.id === id_to_remove).username;
	const request_container = document.getElementById("req_container");
	for (let i = 0; i < request_container.children.length; i++)
	{
		if (request_container.children[i].children[0].textContent == username_to_remove)
		{
			request_container.children[i].remove();
			remove_request_from_data(username_to_remove);
			update_requests_list(false);
			break;
		}
	}
	// in case of 200 status response, which sould not happen, don't create
	// friendship as it already exists
	if (status == "201")
	{
		// TODO: add online and picture
		add_friend_array({id : data.friendship.id, username : data.friendship.username, is_online : Math.random() <= 0.5});
		update_friend_list(false);
		create_popup("You're now friend with " + data.friendship.username + "!",
			2000, 4000,
			hex_color="#00FF0080", t_hover_color="#00FF00C0");
	}
}

async function send_friend_request()
{
	const input_zone = document.getElementById("add_friend_pseudo_input");
	const url = "https://localhost:8443/api/friends/request/send/";
	if (input_zone.value.length == 0)
		return ;
	const body = JSON.stringify({name: input_zone.value});

	let fetched_data = await fetch(url, {
		method: 'POST',
		headers: new Headers({'content-type': 'application/json'}),
		body: body
	});
	try
	{
		if (!fetched_data.ok)
		{
			throw new Error(`${fetched_data.status}`);
		}
		let data = await fetched_data.json();
		data = data.data;
		if (data.hasOwnProperty('remove_friend_request'))
		{
			send_request_lead_to_friendship(data, fetched_data.status);
		}
		else
		{
			send_request(data, fetched_data.status);
		}

	}
	catch (error)
	{
		create_popup("Friend request failed.",
			2000, 4000,
			hex_color="#FF000080", t_hover_color="#FF0000C0");
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
		update_requests_list(false);
}

async function accept_friend_req(event)
{
	const accepted_pseudo = event.target.previousSibling.textContent;
	const accepted_id = data_requests.find(o => o.username === accepted_pseudo)?.id;
	const url = "https://localhost:8443/api/friends/request/" + accepted_id + "/";

	let fetched_data = await fetch(url, {method: 'POST'});
	try
	{
		if (!fetched_data.ok)
		{
			throw new Error(`${fetched_data.status}`);
		}
		let data = await fetched_data.json();
		data = data.data;
		if (fetched_data.status == 201) // the friendship did not exist
		{
			add_friend_array({id: data.friendship.id, username: data.friendship.username, is_online : (Math.random() <= 0.5)})
			update_friend_list(false);
		}
		// remove request
		remove_friend_request_front(event.target, data, accepted_id, accepted_pseudo);
	}
	catch (error)
	{
		create_popup("Accepting request failed.",
			2000, 4000,
			hex_color="#FF000080", t_hover_color="#FF0000C0");
	}
}


async function reject_friend_req(event)
{
	const rejected_pseudo = event.target.parentNode.children[0].textContent;
	const rejected_id = data_requests.find(o => o.username === rejected_pseudo)?.id;
	const url = "https://localhost:8443/api/friends/request/" + rejected_id + "/";

	let fetched_data = await fetch(url, {method:'DELETE'});
	try
	{
		if (!fetched_data.ok)
		{
			throw new Error(`Response status: ${fetched_data.status}`);
		}
		let data = await fetched_data.json();
		data = data.data;
		remove_friend_request_front(event.target, data, rejected_id, rejected_pseudo);
	}
	catch (error)
	{
		create_popup("Rejecting request failed.",
			2000, 4000,
			hex_color="#FF000080", t_hover_color="#FF0000C0");
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
	req_sub_container.className = "req-sub-container";

	const pseudo_text = document.createElement('p');
	pseudo_text.textContent = request_info;
	pseudo_text.className = "req-pseudo";

	const button_accept = document.createElement('button');
	button_accept.tabIndex = "0";
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

function update_requests_list(is_init=false)
{
	const requests_pseudo = get_requests_pseudo();
	const container = document.getElementById('req_container');
	
	if (!is_init)
		empty_requests_list();
	if (requests_pseudo == undefined || requests_pseudo.length == 0)
	{
		const empty_text = document.createElement('p');
		empty_text.textContent = "There is no friend request yet.";
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

async function get_data_from_database()
{
	const url = "https://localhost:8443/api/friends/request/";
	try {
		let fetched_data = await fetch(url);
		if (!fetched_data.ok)
		{
			throw new Error(`${fetched_data.status}`);
		}
		let data = await fetched_data.json();
		return data.data;
	}
	catch (error)
	{
		create_popup("Retrieving friend requests failed.",
			2000, 4000,
			hex_color="#FF000080", t_hover_color="#FF0000C0");
	}
	return undefined;
}

let data_requests = undefined;

document.addEventListener("onModalsLoaded", function()
{
	(async () => {
		data_requests = await get_data_from_database();
		update_requests_list(true);
	})()
});
