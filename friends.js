const DBfriendList = [
	{pseudo: "chat mechant", online: false, picture: "./tiger.jpeg"},
	{pseudo: "kitty", online: true, picture: "./dog.webp"},
	{pseudo: "gros chat", online: true, picture: "./tiger.jpeg"},
	{pseudo: "rose", online: true, picture: "./flower.jpeg"},
	{pseudo: "tigre", online: false, picture: "./tiger.jpeg"},
	{pseudo: "jordi", online: true, picture: "./dog.webp"},
	{pseudo: "fleur", online: false, picture: "./flower.jpeg"}
]

function getFriendProfilPic(friendInfo) {
	const profil_pic = document.createElement("img");
	profil_pic.className = "profil-pic";
	profil_pic.src = friendInfo.picture;
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

function getFriendPseudo(friendInfo)
{
	const text = document.createElement('p');
	text.className = "friend-text";
	text.textContent = friendInfo.pseudo;
	return text;
}

function getFriendOnline(friendInfo)
{
	const isOnline = friendInfo.online;
	const online_dot_div = document.createElement('div');
	online_dot_div.style.position = "relative"

	const online_dot_img = document.createElement('img');
	online_dot_img.src = isOnline ? "./online.png" : "offline.png";
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
	elem.src = "./remove_friend.png";
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
	for (let i = 0; i < DBfriendList.length; i++)
	{
		if (pseudoToRemove == DBfriendList[i].pseudo)
		{
			DBfriendList.splice(i, 1);
			break;
		}
	}
	console.log(elem.parentNode.parentNode.remove())
}

function getFriendList()
{
	const onlineFriendList = [];
	const offlineFriendList = [];

	for (let i = 0; i < DBfriendList.length; i++)
	{
		if (DBfriendList[i].online)
			onlineFriendList.push(DBfriendList[i]);
		else
			offlineFriendList.push(DBfriendList[i]);
	}

	onlineFriendList.sort((a, b) =>
	{
		const name1 = a.pseudo.toLowerCase();
		const name2 = b.pseudo.toLowerCase();
		return name1.localeCompare(name2);
	});

	offlineFriendList.sort((a, b) =>
	{
		const name1 = a.pseudo.toLowerCase();
		const name2 = b.pseudo.toLowerCase();
		return name1.localeCompare(name2);
	});

	return onlineFriendList.concat(offlineFriendList);
}

const friendList = getFriendList();

function construct_friend_list()
{
	for (let i = 0; i < DBfriendList.length; i++)
	{
		const friends_list = document.getElementById('friends-list');
		const newElement = getFriendDiv(friendList[i]);
		newElement.appendChild(getFriendProfilPic(friendList[i]));
		newElement.appendChild(getFriendPseudo(friendList[i]));
		newElement.appendChild(getFriendOnline(friendList[i]));
		friends_list.appendChild(newElement);
	}
}

function position_friend_popup(popup_add_friend)
{
	const add_friend_button = document.getElementById("add_friend_button");
	var rect = add_friend_button.getBoundingClientRect();

	const offsetX = rect.right + 10;
	const offsetY = rect.bottom - (popup_add_friend.bottom - popup_add_friend.top);

	popup_add_friend.style.left = offsetX.toString() + "px";
	popup_add_friend.style.top = offsetY.toString() + "px";
}

function fill_add_popup(popup_add_friend)
{
	const button_add = document.createElement('button');
	button_add.className = "add-friend-popup-button btn";
	button_add.textContent = "Confirm";
	const input_text = document.createElement('input');
	input_text.className = "add-friend-pseudo-input";
	input_text.type = "text";
	input_text.id = "add_friend_pseudo_input";
	input_text.placeholder = "Pseudonyme";
	popup_add_friend.appendChild(input_text);
	popup_add_friend.appendChild(button_add);
}

function show_friend_popup(event)
{
	if (event.key != "Enter" && event.key != null)
		return ;
	const popup_add_friend = document.createElement('div');
	popup_add_friend.id = "popup_add_friend";
	popup_add_friend.className = "popup-add-friend";
	popup_add_friend.style.zIndex = "1";
	popup_add_friend.onkeydown = remove_friends_popup;
	
	position_friend_popup(popup_add_friend);
	fill_add_popup(popup_add_friend);
	
	const friend_text_title = document.getElementById("friend-title");
	friend_text_title.appendChild(popup_add_friend);
	document.getElementById("add_friend_pseudo_input").focus();
	deactivate_friends_button();
}

function remove_friends_popup(event)
{
	if (event) // triggered by event keyboard
	{
		if (event.key != "Escape")
			return;
	}
	document.getElementById("popup_add_friend")?.remove();
	activate_friends_button();
}

function activate_friends_button()
{
	const elem = document.getElementById("add_friend_button");
	elem.onclick = show_friend_popup;
	elem.onkeydown = show_friend_popup;
	friend_popup_just_popped = true;
}

var friend_popup_just_popped = false;

function deactivate_friends_button()
{
	const elem = document.getElementById("add_friend_button");
	elem.onclick = null;
	elem.onkeydown = null;
	friend_popup_just_popped = true;
}

function onWindowResize()
{
	if (is_friend_popup_activated())
	{
		const popup_add_friend = document.getElementById("popup_add_friend");
		position_friend_popup(popup_add_friend);
	}
}

window.onresize = onWindowResize;
const elem = document.getElementById("add_friend_button");
elem.onclick = null;
construct_friend_list();
window.addEventListener('click', (event) =>
{
	if (friend_popup_just_popped)
	{
		friend_popup_just_popped = false;
		return;
	}
	if (!document.getElementById("popup_add_friend")?.contains(event.target))
	{
		remove_friends_popup();
	}
})
activate_friends_button();