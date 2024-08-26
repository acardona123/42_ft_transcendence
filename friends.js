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

construct_friend_list();