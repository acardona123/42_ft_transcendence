function update_pp()
{
	const userImageElements = document.querySelectorAll('.userImage');
	userImageElements.forEach(userImageElement => {
		console.log("changed on " + (global_user_infos !== undefined) + " : ");
		console.log(userImageElement);
		userImageElement.src = (global_user_infos !== undefined) ? global_user_infos.profile_picture : defaultUserImage;
	});
}

async function update_side_menu()
{
	const side_login_path = 'modal_contents/side_menu/menuConnected.html';
	const side_logout_path = 'modal_contents/side_menu/menuDisconnected.html';
	const path_side_menu = (global_user_infos !== undefined) ? side_login_path : side_logout_path;
	try
	{
		let fetched_data = await fetch(path_side_menu);
		let html_to_inject = await fetched_data.text();
		document.getElementById('menuProfile').innerHTML = html_to_inject;
	}
	catch (error)
	{
		console.log(error);
	}
}

// TODO: change (global_user_infos !== undefined) to a function

function updateUI() {

	update_side_menu().then ( () => {
		update_pp();
		updateUserName();
	});
}

function updateUserName() {
	const userNameElements = document.querySelectorAll('.user-name');
	userNameElements.forEach(userNameElement => {
		userNameElement.textContent = global_user_infos?.username;
	});
}

function disableButtonPlay() {
	const buttonPlay = document.getElementById('buttonPlay');
	buttonPlay.disabled = true;

	document.getElementById("menuProfile").addEventListener('hide.bs.offcanvas', function () {
		buttonPlay.disabled = false;
		buttonPlay.focus();
	})
}
