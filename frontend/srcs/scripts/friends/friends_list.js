// const friend_list_data = [
// 	{pseudo: "chat mechant", is_online: false, picture: "./img/tiger.jpeg"},
// 	{pseudo: "kitty", is_online: true, picture: "./img/dog.webp"},
// 	{pseudo: "gros chat", is_online: true, picture: "./img/tiger.jpeg"},
// 	{pseudo: "rose", is_online: true, picture: "./img/flower.jpeg"},
// 	{pseudo: "tigre", is_online: false, picture: "./img/tiger.jpeg"},
// 	{pseudo: "jordi", is_online: true, picture: "./img/dog.webp"},
// 	{pseudo: "fleur", is_online: false, picture: "./img/flower.jpeg"}
// ]

function getFriendProfilPic(picture) {
	const profil_pic = document.createElement("img");
	profil_pic.className = "profil-pic";
	profil_pic.src = picture;
	return profil_pic;
}

function getFriendDiv()
{
	const div_object = document.createElement('div');
	div_object.className = "friend-div friend-container";
	div_object.onmouseenter = remove_friend_enter;
	div_object.onmouseleave = remove_friend_leave;
	return div_object;
}

function getFriendPseudo(pseudo)
{
	const text = document.createElement('p');
	text.className = "friend-text";
	text.textContent = pseudo;
	return text;
}

function getFriendOnline(f_is_online)
{
	const is_online = f_is_online;
	const online_dot_div = document.createElement('div');
	online_dot_div.className = "online-dot-div";
	const online_dot_img = document.createElement('img');
	online_dot_img.src = is_online ? "./img/online.png" : "./img/offline.png";
	online_dot_img.className = "friend-online-dot";
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
		elem.src = "./img/trash.png";
		clicked_once = false;
	}
	else // on mouse
	{
		elem = elem.childNodes[2].childNodes[0];
		lastReplacedElemHover = elem;
		elem.src = "./img/trash.png";
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

	confirm_trash.src = "./img/confirm_remove_friend.png";
	cancel_trash.src = "./img/remove_friend.png";
	confirm_trash.className = "confirm-remove-friend";
	cancel_trash.className = "confirm-remove-friend";
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
	const pseudo_to_remove = elem.parentNode.parentNode.childNodes[1].textContent;

	const url = "https://localhost:8443/api/friends/remove/"
		+ friend_list_data.find(o => o.username === pseudo_to_remove).id + "/";

	let data = await fetch(url, {method:'DELETE'});
	try
	{
		if (!data.ok)
		{
			throw new Error(`Response status: ${data.status}`);
		}
		// TODO: update friends with the body returned
	}
	catch (error)
	{
		// TODO: popup error
		console.log("Friend request reject failed: " + error.message);
		return ;
	}
}

function add_friend(pseudo, is_online, picture)
{
	const newElement = getFriendDiv();
	newElement.appendChild(getFriendProfilPic(picture));
	newElement.appendChild(getFriendPseudo(pseudo));
	newElement.appendChild(getFriendOnline(is_online));
	return newElement;
}

function sort_by_online_alpha(data)
{
	const online_friend_list = [];
	const offline_friend_list = [];

	for (let i = 0; i < data.length; i++)
	{
		if (data[i].is_online)
			online_friend_list.push(data[i]);
		else
			offline_friend_list.push(data[i]);
	}

	online_friend_list.sort((a, b) =>
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

	return online_friend_list.concat(offline_friend_list);
}

async function get_friend_list()
{
	const url = "https://localhost:8443/api/friends/";
	let data = await fetch(url);
	try
	{
		if (!data.ok)
		{
			throw new Error(`Response status: ${data.status}`);
		}
		data = await data.json();
	}
	catch (error)
	{
		// TODO: popup error
		console.log("Display friends failed: " + error.message);
		return undefined;
	}
	data = data.map(data => (
		{id: data.id, username: data.username, is_online: (Math.random() <= 0.5)}
	));
	return sort_by_online_alpha(data);
}

function empty_friend_list()
{
	const friends_list = document.getElementById('friends-list');
	while (friends_list.childNodes.length != 0)
	{
		friends_list.childNodes[0].remove();
	}
}

function update_friend_list(is_init)
{
	if (!is_init)
		empty_friend_list();
	for (let i = 0; i < friend_list_data.length; i++)
	{
		const friends_list = document.getElementById('friends-list');
		const new_friend = add_friend(friend_list_data[i].username, friend_list_data[i].is_online, friend_list_data[i].picture)
		friends_list.appendChild(new_friend);
	}
	if (friend_list_data.length == 0)
	{
		const friends_list = document.getElementById('friends-list');
		const empty_text = document.createElement('p');
		empty_text.textContent = "There is no friend to display yet."
		empty_text.style.textAlign = "center";
		friends_list.appendChild(empty_text);
	}
}

let friend_list_data = undefined;

(async () => {
	friend_list_data = await get_friend_list()
	if (friend_list_data != undefined)
		update_friend_list(true);
})()

