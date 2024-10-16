
// UPDATE UI

function updateUI() {
	// Determine which HTML content to load
	const side_login_path = 'modal_contents/side_menu/menuConnected.html';
	const side_logout_path = 'modal_contents/side_menu/menuDisconnected.html';
	const menuHtml = (global_user_infos !== undefined) ? side_login_path : side_logout_path;
		
	// Load the menu HTML content
	fetch(menuHtml)
		.then(response => response.text())
		.then(html => {
			document.getElementById('menuProfile').innerHTML = html;

			const userImageElements = document.querySelectorAll('.userImage');
			userImageElements.forEach(userImageElement => {
				userImageElement.src = (global_user_infos !== undefined) ? global_user_infos.profile_picture : defaultUserImage;
			});

			updateUserName();
			toggleConnectionBadge();
			updateCircle(ratio, win, loss);
		})
		.catch(error => console.error('Error loading menu HTML:', error));
}

// ======================================

/* Variable */

const USER = {name: "John Doe", type: "player", id: 1421};

let defaultUserImage = 'img/compte-utilisateur-1.png';
let win = 10;
let loss = 14;
let ratio = (win / (win + loss)) * 100;

// ======================================

// USER NAME

function updateUserName() {
	const userNameElements = document.querySelectorAll('.user-name'); // Select all elements with class 'userName'
	userNameElements.forEach(userNameElement => {
		if (userNameElement) { // Check if the element exists
			userNameElement.textContent = global_user_infos?.username; // Set the user's name
		} else {
			console.error('Element with class "userName" not found.');
		}
	});
}

// ======================================

// CONNECTION BADGE

function toggleConnectionBadge() {
	const badge = document.getElementById('connection-badge');
	if (badge) {
		if ((global_user_infos !== undefined)) {
			badge.style.backgroundColor = 'green';
		} else {
			badge.style.backgroundColor = 'red';
		}
	}
}

// ======================================

// STATS CIRCLE

function updateCircle(ratio, victories, defeats) {
	ratio = parseFloat(ratio.toFixed(2));

	const circleContainer = document.querySelector('.win-loss-circle');

	if ((global_user_infos !== undefined) && circleContainer) {
		circleContainer.style.setProperty('--ratio', `${ratio}%`);

		circleContainer.setAttribute('title', `Victories: ${victories}, Defeats: ${defeats}, Ratio: ${ratio}%`);
	}
}

function disableButtonPlay() {
	const buttonPlay = document.getElementById('buttonPlay');
	if (buttonPlay) {
		buttonPlay.disabled = true;
	}

	document.getElementById("menuProfile").addEventListener('hide.bs.offcanvas', function () {
		if (buttonPlay) {
			buttonPlay.disabled = false;
			buttonPlay.focus();
		}
	})
}
