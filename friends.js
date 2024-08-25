const nb_friends_debug = 1

function getFriendProfilPic() {
	const profil_pic = document.createElement("img");
	profil_pic.className = "profil-pic"
	profil_pic.src = "./image.jpeg";
	return profil_pic;
}

function getFriendDiv()
{
	const div_object = document.createElement('div');
	div_object.className = "friends-div"
	return div_object;
}


document.getElementById('addElements').addEventListener('click', function() {

	for (let i = 0; i < nb_friends_debug; i++)
	{
		const friends_list = document.getElementById('friends-list');
		const newElement = getFriendDiv();
		newElement.appendChild(getFriendProfilPic());
		friends_list.appendChild(newElement);
	}
});