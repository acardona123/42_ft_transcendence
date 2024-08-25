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
	const isOnline = friendInfo.online; // get from back
	const online_dot_div = document.createElement('div');
	online_dot_div.style.position = "relative"

	const online_dot_img = document.createElement('img');
	online_dot_img.src = isOnline ? "./online.png" : "offline.png";
	online_dot_img.className = "friend-online-dot";

	online_dot_div.appendChild(online_dot_img)
	return online_dot_div;
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

for (let i = 0; i < DBfriendList.length; i++)
{
	const friends_list = document.getElementById('friends-list');
	const newElement = getFriendDiv(friendList[i]);
	newElement.appendChild(getFriendProfilPic(friendList[i]));
	newElement.appendChild(getFriendPseudo(friendList[i]));
	newElement.appendChild(getFriendOnline(friendList[i]));
	friends_list.appendChild(newElement);
}
