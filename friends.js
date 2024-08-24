const nb_friends_debug = 1

// customElements.define('truc');

function getFriendTemplate() {
	const profil_pic = document.createElement("img");
	profil_pic.src = "./image.jpeg"
	// profil_pic.style.height = "100px";
	// profil_pic.style.width = "100px";
	return profil_pic
}


document.getElementById('addElements').addEventListener('click', function() {

	for (let i = 0; i < nb_friends_debug; i++)
	{
		const friends_list = document.getElementById('friends-list');
		const newElement = document.createElement('div');
		newElement.appendChild(getFriendTemplate())
		friends_list.appendChild(newElement);
	}
});