class ModalManager {
	constructor(modalId, button = undefined) {
		this.modal = new bootstrap.Modal(document.getElementById(modalId));

		if (button) {
			/* EVENT PART */
			const btn = document.getElementById(button);
			document.getElementById(modalId).addEventListener('hidden.bs.modal', function () {
				if (btn) {
					btn.disabled = false;
					btn.focus();
				}
			})
			/* ============== */
		}
	}

	showModal() {
		this.modal.show();
	}

	hideModal() {
		this.modal.hide();
	}
}

var modalLogin = undefined;
var modalSignUp = undefined;
var modalPlay = undefined;
var modalIAMatchCreation = undefined;
var modal1v1MatchCreation = undefined;
var modalParameters = undefined;

function openModalLogin() {

	modalLogin = new ModalManager('modalLogin');

	// fetch('html-menuContent/login.html')
	// 	.then(function (data) {
	// 		return data.text();
	// 	})
	// 	.then(function (html) {
	// 		document.getElementById('modalLoginContent').innerHTML = html;
	// 	});

	var modaldialog = document.getElementById('modalLoginDialog');
	modaldialog.classList.remove('slide-center-to-right');
	modaldialog.classList.add('slide-right');
	modalLogin.showModal();
}

function closeModalLogin() {
	var modaldialog = document.getElementById('modalLoginDialog');
	modaldialog.classList.remove('slide-right');
	modaldialog.classList.add('slide-center-to-right');
	setTimeout(function () {
		modalLogin.hideModal();
	}, 500);
}
// 

function openModalSignUp() {

	modalSignUp = new ModalManager('modalSignUp');

	// fetch('html-menuContent/login.html')
	// .then(function (data) {
	// 	return data.text();
	// })
	// .then(function (html) {
	// 	document.getElementById('modalSignUpContent').innerHTML = html;
	// });

	var modaldialog = document.getElementById('modalSignUpDialog');
	modaldialog.classList.remove('slide-center-to-right');
	modaldialog.classList.add('slide-right');
	modalSignUp.showModal();
}

function closeModalSignUp() {
	var modaldialog = document.getElementById('modalSignUpDialog');
	modaldialog.classList.remove('slide-left');
	modaldialog.classList.add('slide-center-to-right');
	setTimeout(function () {		/* EVENT PART */
		document.getElementById("modalPlay").addEventListener('hidden.bs.modal', function () {
			if (button) {
				button.disabled = false;
				button.focus();
			}
		})
		/* ============== */
		modalSignUp.hideModal();
	}, 500);
}


function openModalIAMatchCreation() {
	modalPlay.hideModal();

	modalIAMatchCreation = new ModalManager('modalIAMatchCreation');

	var modaldialog = document.getElementById('modal-ia-match-creation-dialog');
	modaldialog.classList.add('grow-top-left');
	initMatchIACreation();
	modalIAMatchCreation.showModal();
}

function hideModalIAMatchCreation() {
	var modaldialog = document.getElementById('modal-ia-match-creation-dialog');
	modaldialog.classList.remove('grow-top-left');
	modalIAMatchCreation.hideModal();
}

// 

function openModal1v1MatchCreation() {
	modalPlay.hideModal();

	modal1v1MatchCreation = new ModalManager('modal1v1MatchCreation');

	var modaldialog = document.getElementById('modal-1v1-match-creation-dialog');
	modaldialog.classList.add('grow-top-right');
	initMatch1v1Creation();
	modal1v1MatchCreation.showModal();
}

function hideModal1v1MatchCreation() {
	var modaldialog = document.getElementById('modal-1v1-match-creation-dialog');
	modaldialog.classList.remove('grow-top-right');
	modal1v1MatchCreation.hideModal();
}

// 

function openModalPlay() {

	if (modalPlay === undefined) {
		modalPlay = new ModalManager('modalPlay', 'buttonPlay');
	}

	button = document.getElementById('buttonPlay');
	if (button) {
		button.disabled = true;
		button.removeAttribute('autofocus');
	}
	modalPlay.showModal();
}


function returnToModalPlay(source) {
	if (source === 'IAMatchCreation') {
		hideModalIAMatchCreation();
	}
	else if (source === '1v1MatchCreation') {
		clearInputFields();
		console.log('ADDFOCUSOUTLISTENER');
		addFocusOutListener();
		// hidePlayer2ConnectionSection();
		// initBoxs();
		hideModal1v1MatchCreation();
	}
	modalPlay.showModal();
}

// 

function openModalParameters() {
	modalParameters = new ModalManager('modalMedium');

	modalParameters.showModal();
}

function keypressModalParameters(event) {
	if (event.key === 'Enter') {
		// const offcanvas = new bootstrap.Offcanvas(document.getElementById('menuProfile'));
		// offcanvas.toggle();
		// offcanvas.hide();
		// console.log(offcanvas);
		openModalParameters();
	}
}

function closeModalParameters() {
	modalParameters.hideModal();
}

document.addEventListener("DOMContentLoaded", function () {
	// setTimeout(function() {
	// 	/* EVENT PART */
	// 	document.getElementById("modalPlay").addEventListener('hidden.bs.modal', function () {
	// 		console.log('modalPlay hidden');
	// 		if (button) {
	// 			button.disabled = false;
	// 			button.focus();
	// 		}
	// 	})
	// }, 1000);
	/* ============== */
	// setInterval(function() {
	// 	console.log(document.activeElement);
	// }
	// , 1000);
});

// console.log(document.activeElement);
