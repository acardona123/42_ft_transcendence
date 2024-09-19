function send_request(data, status)
{
	if (status == "201")
	{
		// popup request sent 
		console.log("request sent with success");// send popup
	}
	else
	{
		// popup sent request already exists
		console.log("already exist");// already exist
	}
	console.log("send")
}


function send_request_lead_to_friendship(data, status)
{
	const id_to_remove = data.remove_friend_request;
	if (status == "201")
	{
		// remove request + add friendship
		// remove request
		const username_to_remove = data_requests.find(o => o.id == id_to_remove).username;
		const request_container = document.getElementById("req_container");
		for (let i = 0; i < request_container.length; i++)
		{
			if (request_container[i].children[1].textContent == username_to_remove)
			{
				request_container[i].children[1].remove();
				break;
			}
		}
		// add friendship
		// TODO: add online and picture
		add_friend_array({id : data.friendship.id, username : data.friendship.username, is_online : Math.random() <= 0.5});
	}
	else
	{
		// remove request
		console.log(status.toString());
	}
	console.log("send f")
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
			throw new Error(`Response status: ${fetched_data.status}`);
		}
		let data = await fetched_data.json();
		data = data.data;
		console.log(data);
		if (data.data?.remove_friend_request != undefined)
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
		// TODO: popup error
		console.log("Friend request accept failed: " + error.message);
	}
	remove_friends_popup();
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
			throw new Error(`Response status: ${fetched_data.status}`);
		}
		let data = await fetched_data.json();
		data = data.data;
		if (fetched_data.status == 201) // the friendship did not exist
		{
			add_friend_array({id: data.friendship.id, username: data.friendship.username, is_online : (Math.random() <= 0.5)})
			update_friend_list(false);
		}

		// remove request
		let id_to_remove_back = data.remove_friend_request;
		const elem = event.target;
		if (accepted_id != id_to_remove_back)
		{
			// kind of heavy to perform but it should not happen in a normal back communication
			let new_pseudo_to_remove = data_requests.find(o => o.id === id_to_remove_back).username;
			let children = elem.parentNode.parentNode.children;
			for (let i = 0; i < children.length; i++)
			{
				if (children[i].children[0].textContent == new_pseudo_to_remove)
				{
					children[i].remove();
					break;
				}
			}
		} // normal back communication case
		else
			elem.parentNode.remove();
	}
	catch (error)
	{
		// TODO: popup error
		console.log("Friend request accept failed: " + error.message);
		return ;
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
		console.log(data);

		// remove request
		let id_to_remove_back = data.friend_request;
		const elem = event.target;
		if (rejected_id != id_to_remove_back)
		{
			// kind of heavy to perform but it should not happen in a normal back communication
			let new_pseudo_to_remove = data_requests.find(o => o.id === id_to_remove_back).username;
			let children = elem.parentNode.parentNode.children;
			for (let i = 0; i < children.length; i++)
			{
				if (children[i].children[0].textContent == new_pseudo_to_remove)
				{
					children[i].remove();
					break;
				}
			}
		} // normal back communication case
		else
			elem.parentNode.remove();
	}
	catch (error)
	{
		// TODO: popup error
		console.log("Friend request accept failed: " + error.message);
		return ;
	}
}

function get_requests_pseudo()
{
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

function update_requests_list(is_init)
{
	const requests_pseudo = get_requests_pseudo();
	const container = document.getElementById('req_container');
	
	if (!is_init)
		empty_requests_list();
	
	if (requests_pseudo.length == 0)
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
	let fetched_data = await fetch(url);
	try {
		if (!fetched_data.ok)
		{
			throw new Error(`Response status: ${fetched_data.status}`);
		}
		let data = await fetched_data.json();
		return data.data;
	}
	catch (error)
	{
		// TODO: popup error
		console.log("Friend request fetch failed: " + error.message);
	}
	return undefined;
}

let data_requests = undefined;
(async () => {
	data_requests = await get_data_from_database();
	if (data_requests != undefined)
		update_requests_list();
})()
