function updateUI() {
	const side_login_path = 'modal_contents/side_menu/menuConnected.html';
	const side_logout_path = 'modal_contents/side_menu/menuDisconnected.html';
	const menuHtml = (global_user_infos !== undefined) ? side_login_path : side_logout_path;
		
	fetch(menuHtml)
		.then(response => response.text())
		.then(html => {
			document.getElementById('menuProfile').innerHTML = html;

			const userImageElements = document.querySelectorAll('.userImage');
			userImageElements.forEach(userImageElement => {
				userImageElement.src = (global_user_infos !== undefined) ? global_user_infos.profile_picture : defaultUserImage;
			});
			updateUserName();
		})
		.catch(error => console.error('Error loading menu HTML:', error));
}

let defaultUserImage = 'img/compte-utilisateur-1.png';

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
