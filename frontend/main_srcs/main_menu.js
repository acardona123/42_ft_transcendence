function update_pp()
{
	const userImageElements = document.querySelectorAll('.userImage');
	userImageElements.forEach(userImageElement => {
		userImageElement.src = is_connected() ? global_user_infos.profile_picture : defaultUserImage;
	});
}

function updateUI() {

	update_side_menu();
	update_pp();
	updateUserName();
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
