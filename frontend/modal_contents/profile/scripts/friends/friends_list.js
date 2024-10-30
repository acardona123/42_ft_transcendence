const PATH_ONLINE_DOT = "modal_contents/profile/img/online.png";
const PATH_OFFLINE_DOT = "modal_contents/profile/img/offline.png";
const PATH_INACTIVE_DOT = "modal_contents/profile/img/inactive.png";

function getFriendProfilPic(picture) {
	const profil_pic = document.createElement("img");
	profil_pic.className = "prof-profil-pic";
	profil_pic.src = picture;
	return profil_pic;
}

function getFriendDiv()
{
	const div_object = document.createElement('div');
	div_object.className = "prof-friend-div prof-friend-container";
	div_object.onmouseenter = remove_friend_enter;
	div_object.onmouseleave = remove_friend_leave;
	return div_object;
}

function getFriendPseudo(pseudo)
{
	const text = document.createElement('p');
	text.className = "prof-friend-text";
	text.textContent = pseudo;
	return text;
}

function getFriendOnline(online_status)
{
	const online_dot_div = document.createElement('div');
	online_dot_div.className = "prof-online-dot-div";
	const online_dot_img = document.createElement('img');
	if (online_status == "online")
		online_dot_img.src = PATH_ONLINE_DOT;
	else if (online_status == "inactif")
		online_dot_img.src = PATH_INACTIVE_DOT;
	else
		online_dot_img.src = PATH_OFFLINE_DOT;
	online_dot_img.className = "prof-friend-online-dot";
	online_dot_img.href = online_dot_img.src;
	online_dot_img.tabIndex = "0";
	online_dot_img.onclick = remove_friend;
	online_dot_img.onkeydown = remove_friend;
	online_dot_img.addEventListener('focusin', remove_friend_enter);
	online_dot_img.addEventListener('focusout', remove_friend_leave);

	online_dot_div.appendChild(online_dot_img);
	return online_dot_div;
}

let lastReplacedElemFocus = undefined;
let lastReplacedElemHover = undefined;

function remove_friend_enter(event)
{
	let elem = event.currentTarget;
	if (event.type == 'focusin') // on focus
	{
		lastReplacedElemFocus = elem;
		elem.src = "modal_contents/profile/img/trash.png";
		clicked_once = false;
	}
	else // on mouse
	{
		elem = elem.childNodes[2].childNodes[0];
		lastReplacedElemHover = elem;
		elem.src = "modal_contents/profile/img/trash.png";
	}
}

function remove_friend_leave(event)
{
	let elem = event.currentTarget;
	if (event.type == 'focusout') // on focus
	{
		if (lastReplacedElemHover != elem)
		{
			clicked_once = false;
			elem.src = elem.href;
			elem.parentNode.childNodes[1]?.remove();
		}
		lastReplacedElemFocus = undefined;
	}
	else // on mouse
	{
		if (lastReplacedElemFocus != elem.childNodes[2].childNodes[0] || clicked_once)
		{
			if (clicked_once)
			{
				elem.childNodes[2].childNodes[1]?.remove();
				elem.childNodes[2].childNodes[0].style.display = "";
			}
			elem.childNodes[2].childNodes[1]?.remove();
			elem = elem.childNodes[2].childNodes[0];
			elem.src = elem.href;
			clicked_once = false;
		}
		lastReplacedElemHover = undefined;
	}
}

let clicked_once = false;

function set_confim_remove(target)
{
	target.style.display = "none";

	const confirm_trash = document.createElement('img');
	const cancel_trash = document.createElement('img');

	confirm_trash.src = "modal_contents/profile/img/confirm_remove_friend.png";
	cancel_trash.src = "main_srcs/img/remove_friend.png";
	confirm_trash.className = "prof-confirm-remove-friend";
	cancel_trash.className = "prof-confirm-remove-friend";
	confirm_trash.onclick = remove_friend;
	cancel_trash.onclick = cancel_confirm_remove;

	target.parentNode.appendChild(confirm_trash);
	target.parentNode.appendChild(cancel_trash);
}

function cancel_confirm_remove(event)
{
	const elem = event.currentTarget.parentNode;

	elem.childNodes[0].style.display = "";
	elem.childNodes[1].remove();
	elem.childNodes[1].remove();
}

// remove do not reload all the friend list to save time
async function remove_friend(event)
{
	if (event.type == "keydown")
	{
		if (event.key != "Enter")
			return;
	}
	if (!clicked_once)
	{
		set_confim_remove(event.currentTarget);
		clicked_once = true;
		return ;
	}
	const elem = event.currentTarget;
	const elem_list_parent = elem.parentNode.parentNode.parentNode;
	const pseudo_to_remove = elem.parentNode.parentNode.childNodes[1].textContent;
	const id_to_remove = friend_list_data.find(o => o.username === pseudo_to_remove).id;

	const url = "https://localhost:8443/api/friends/remove/" + id_to_remove + "/";
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'DELETE',
			headers: {}
		});
		if (!fetched_data.ok)
			throw new Error(`${fetched_data.status}`);
		fetched_data = await fetched_data.json();
		let id_to_remove_back = fetched_data.data.friendship;
		if (id_to_remove != id_to_remove_back)
		{
			// kind of heavy to perform but it should not happen in a normal back communication
			let new_pseudo_to_remove = friend_list_data.find(o => o.id === id_to_remove_back).username;
			let children = elem.parentNode.parentNode.parentNode.children;
			for (let i = 0; i < children.length; i++)
			{
				if (children[i].children[1].textContent == new_pseudo_to_remove)
				{
					children[i].remove();
					remove_friend_array(new_pseudo_to_remove);
					break;
				}
			}
		} // normal back communication case
		else
		{
			elem.parentNode.parentNode.remove();
			remove_friend_array(pseudo_to_remove);
		}
		if (elem_list_parent.children.length == 0)
			update_friend_list_front();
	}
	catch (error)
	{
		create_popup("Removing friend failed.",
			4000, 4000,
			hex_color=HEX_RED, t_hover_color=HEX_RED_HOVER);
	}
}

function add_friend_array(elem)
{
	friend_list_data.push(elem);
}

function remove_friend_array(username_to_remove)
{
	friend_list_data.splice(friend_list_data.findIndex(o => o.username === username_to_remove), 1);
}

function add_friend_front(pseudo, online_status, picture)
{
	const newElement = getFriendDiv();
	newElement.appendChild(getFriendProfilPic(picture));
	newElement.appendChild(getFriendPseudo(pseudo));
	newElement.appendChild(getFriendOnline(online_status));
	return newElement;
}

function sort_by_online_alpha(data)
{
	const online_friend_list = [];
	const inactive_friend_list = [];
	const offline_friend_list = [];

	for (let i = 0; i < data.length; i++)
	{
		if (data[i].online_status == "online")
			online_friend_list.push(data[i]);
		else if (data[i].online_status == "inactive")
			inactive_friend_list.push(data[i]);
		else
			offline_friend_list.push(data[i]);
	}

	online_friend_list.sort((a, b) =>
	{
		const name1 = a.username.toLowerCase();
		const name2 = b.username.toLowerCase();
		return name1.localeCompare(name2);
	});
	inactive_friend_list.sort((a, b) =>
	{
		const name1 = a.username.toLowerCase();
		const name2 = b.username.toLowerCase();
		return name1.localeCompare(name2);
	});
	offline_friend_list.sort((a, b) =>
	{
		const name1 = a.username.toLowerCase();
		const name2 = b.username.toLowerCase();
		return name1.localeCompare(name2);
	});
	return online_friend_list.concat(inactive_friend_list.concat(offline_friend_list));
}

async function get_friend_list()
{
	const url = "https://localhost:8443/api/friends/";
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method : 'GET',
			headers: {}
		});
		if (!fetched_data.ok)
			throw new Error(`${fetched_data.status}`);

		fetched_data = await fetched_data.json();
		let data = fetched_data.data;
		data = data.map(data => ({
				id: data.id,
				username: data.username,
				online_status: data.status,
				profile_picture: data.profile_picture
			}));
		return sort_by_online_alpha(data);
	}
	catch (error)
	{
		create_popup("Retrieving friend list failed.",
			4000, 4000,
			hex_color=HEX_RED, t_hover_color=HEX_RED_HOVER);
	}
	return undefined;
}

function empty_friend_list()
{
	const friends_list = document.getElementById('friends-list');
	while (friends_list.childNodes.length != 0)
	{
		friends_list.childNodes[0].remove();
	}
}

function update_friend_list_front()
{
	empty_friend_list();
	if (friend_list_data == undefined || friend_list_data.length == 0)
	{
		const friends_list = document.getElementById('friends-list');
		const empty_text = document.createElement('p');
		empty_text.textContent = "There is no friend to display yet."
		empty_text.style.textAlign = "center";
		empty_text.style.color = "var(--lavender)";
		friends_list.appendChild(empty_text);
		return ;
	}
	for (let i = 0; i < friend_list_data.length; i++)
	{
		const friends_list = document.getElementById('friends-list');
		const new_friend = add_friend_front(friend_list_data[i].username, friend_list_data[i].online_status, friend_list_data[i].profile_picture)
		friends_list.appendChild(new_friend);
	}
}

let friend_list_data = undefined;

async function setup_friend_list()
{
	friend_list_data = await get_friend_list();
	update_friend_list_front();
}
