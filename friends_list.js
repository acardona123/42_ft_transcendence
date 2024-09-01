const DB_friend_list = [
	{pseudo: "chat mechant", is_online: false, picture: "./img/tiger.jpeg"},
	{pseudo: "kitty", is_online: true, picture: "./img/dog.webp"},
	{pseudo: "gros chat", is_online: true, picture: "./img/tiger.jpeg"},
	{pseudo: "rose", is_online: true, picture: "./img/flower.jpeg"},
	{pseudo: "tigre", is_online: false, picture: "./img/tiger.jpeg"},
	{pseudo: "jordi", is_online: true, picture: "./img/dog.webp"},
	{pseudo: "fleur", is_online: false, picture: "./img/flower.jpeg"}
]

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
	online_dot_div.style.position = "relative"

	const online_dot_img = document.createElement('img');
	online_dot_img.src = is_online ? "./img/online.png" : "./img/offline.png";
	online_dot_img.className = "friend-online-dot";
	online_dot_img.onclick = remove_friend;

	online_dot_div.appendChild(online_dot_img);
	return online_dot_div;
}

let lastReplacedImg = "";

function remove_friend_enter(event)
{
	const elem = event.currentTarget.childNodes[2].childNodes[0];
	lastOnlineBuffer = elem.src;
	elem.src = "./img/remove_friend.png";
}

function remove_friend_leave(event)
{
	const elem = event.currentTarget.childNodes[2].childNodes[0];
	elem.src = lastOnlineBuffer;
}

function remove_friend(event)
{
	const elem = event.currentTarget;
	const pseudoToRemove = elem.parentNode.parentNode.childNodes[1].textContent;
	// DELETE on database
	// since no databse yet, do :
	for (let i = 0; i < DB_friend_list.length; i++)
	{
		if (pseudoToRemove == DB_friend_list[i].pseudo)
		{
			DB_friend_list.splice(i, 1);
			break;
		}
	}
	elem.parentNode.parentNode.remove()
}

function add_friend(pseudo, is_online, picture)
{
	const newElement = getFriendDiv();
	newElement.appendChild(getFriendProfilPic(picture));
	newElement.appendChild(getFriendPseudo(pseudo));
	newElement.appendChild(getFriendOnline(is_online));
	return newElement;
}

function get_friend_list()
{
	const online_friend_list = [];
	const offline_friend_list = [];

	for (let i = 0; i < DB_friend_list.length; i++)
	{
		if (DB_friend_list[i].online)
			online_friend_list.push(DB_friend_list[i]);
		else
			offline_friend_list.push(DB_friend_list[i]);
	}

	online_friend_list.sort((a, b) =>
	{
		const name1 = a.pseudo.toLowerCase();
		const name2 = b.pseudo.toLowerCase();
		return name1.localeCompare(name2);
	});

	offline_friend_list.sort((a, b) =>
	{
		const name1 = a.pseudo.toLowerCase();
		const name2 = b.pseudo.toLowerCase();
		return name1.localeCompare(name2);
	});

	return online_friend_list.concat(offline_friend_list);
}

function construct_friend_list()
{
	const friend_list = get_friend_list();
	for (let i = 0; i < friend_list.length; i++)
	{
		const friends_list = document.getElementById('friends-list');
		const new_friend = add_friend(friend_list[i].pseudo, friend_list[i].is_online, friend_list[i].picture)
		friends_list.appendChild(new_friend);
	}
}

construct_friend_list();
