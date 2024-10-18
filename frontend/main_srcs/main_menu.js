function update_pp()
{
	const userImageElements = document.querySelectorAll('.userImage');
	userImageElements.forEach(userImageElement => {
		userImageElement.src = is_connected() ? global_user_infos.profile_picture : defaultUserImage;
	});
}

function update_ui() {

	update_side_menu();
	update_pp();
	update_user_name();
}

function update_user_name() {
	const userNameElements = document.querySelectorAll('.user-name');
	userNameElements.forEach(userNameElement => {
		userNameElement.textContent = global_user_infos?.username;
	});
}

function disable_buttons_play() {
	const buttons = document.querySelectorAll('.btn-play');
	buttons.forEach(button => {
		button.disabled = true;
		button.removeAttribute('autofocus');
	});
}

function enable_buttons_play_event_offcanvas() {
	document.getElementById("menuProfile").addEventListener('hide.bs.offcanvas', function () {
		const buttons = document.querySelectorAll('.btn-play');
		buttons.forEach(button => {
			button.disabled = false;
			button.focus();
		})
	});

}
