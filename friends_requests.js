const g_requests = [
	{pseudo : "johanne", date : 4},
	{pseudo : "quentin", date : 3},
	{pseudo : "alexandre", date : 5},
	{pseudo : "alex", date : 2},
	{pseudo : "arthur", date : 1},
	{pseudo : "arthur", date : 1},
	{pseudo : "arthur", date : 1},
	{pseudo : "arthur", date : 1},
	{pseudo : "arthur", date : 1},
	{pseudo : "arthur", date : 1},
	{pseudo : "arthur", date : 1},
];

function send_friend_request(event)
{
	const input_zone = document.getElementById("add_friend_pseudo_input")
	// send JSON to the back
	// JSON.stringify({"pseudo" : input_zone.value});
	remove_friends_popup();
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

function get_req_container()
{
	const friends_div = document.getElementById('sec_friend');
	const container = document.createElement('div');

	container.className = "req-container";
	friends_div.appendChild(container);
	return container;
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

	const button_reject = document.createElement('button');
	button_reject.className = "req-reject-button btn";
	button_reject.textContent = "Reject";

	req_sub_container.appendChild(pseudo_text);
	req_sub_container.appendChild(button_accept);
	req_sub_container.appendChild(button_reject);
	
	return req_sub_container;
}

function generate_requests_list()
{
	const requests_pseudo = get_requests_pseudo();
	const container = get_req_container();
	console.log(container);

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

generate_requests_list();