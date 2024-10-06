
// UPDATE UI

function updateUI() {
    // Determine which HTML content to load
	const side_login_path = 'modal_contents/side_menu/menuConnected.html';
	const side_logout_path = 'modal_contents/side_menu/menuDisconnected.html';
    const menuHtml = isConnected ? side_login_path : side_logout_path;
    
    // Load the menu HTML content
    fetch(menuHtml)
        .then(response => response.text())
        .then(html => {
            document.getElementById('menuProfile').innerHTML = html;

			// Update user images based on connection status
			const userImageElements = document.querySelectorAll('.userImage'); // Select all elements with class 'userImage'
			userImageElements.forEach(userImageElement => {
				if (userImageElement) { // Check if the element exists
					userImageElement.src = isConnected ? userImage :defaultUserImage; // Set the user's image
				} else {
					console.error('Element with class "userImage" not found.');
				}
			});

            // Inject the user's name into elements with class 'userName'
			updateUserName();

			// Update the badge color based on connection status
			toggleConnectionBadge();
			// change the border color of the connected image menu
			{
				// const connectedImageMenu = document.getElementById('connectedImageMenu');
				// connectedImageMenu.style.border = "2px solid" + '#' + Math.floor(Math.random() * 16777215).toString(16); 
			}
            updateCircle(ratio, win, loss); // Update circle and tooltip to show 75% win ratio with 75 victories and 25 defeats


        })
        .catch(error => console.error('Error loading menu HTML:', error));
}

// ======================================

/* Variable */

const USER = {name: "John Doe", type: "player", id: 1421};

let isConnected = true;
let userName = 'John Doe';
// let userImage = 'imgliargame-pp.png';
let userImage = 'img/GP_poster.jpeg';
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
			userNameElement.textContent = userName; // Set the user's name
		} else {
			console.error('Element with class "userName" not found.');
		}
	});
}

// ======================================

function logout() {
    // Simulate successful logout
    isConnected = false;
    updateUI();
}

// ======================================

// CONNECTION BADGE

function toggleConnectionBadge() {
    const badge = document.getElementById('connection-badge');
	if (badge) {
		if (isConnected) {
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

    if (isConnected && circleContainer) {
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
