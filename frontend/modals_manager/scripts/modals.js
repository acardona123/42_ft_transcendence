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
var modalTournamentMatchCreation = undefined;
var modalEditProfile = undefined;
var modalProfile = undefined;
var modalTwoFASetup = undefined;
var modalTwoFAValid = undefined;

function openModalLogin() {

	modalLogin = new ModalManager('modal-login');

	var modaldialog = document.getElementById('modal-login-dialog');
	modaldialog.classList.add('slide-right');
	clear_login_inputs();
	modalLogin.showModal();
	document.getElementById("input-login-username").focus();
}

function closeModalLogin() {
	var modaldialog = document.getElementById('modal-login-dialog');
	modaldialog.classList.remove('slide-right');
	modalLogin.hideModal();
}
// 

function openModalSignUp() {

	modalSignUp = new ModalManager('modal-register');

	var modaldialog = document.getElementById('modal-register-dialog');
	modaldialog.classList.remove('slide-center-to-right');
	modaldialog.classList.add('slide-right');
	clear_register_inputs();
	modalSignUp.showModal();
	document.getElementById("input-register-username").focus();
}

function closeModalSignUp() {
	var modaldialog = document.getElementById('modal-register-dialog');
	modaldialog.classList.remove('slide-left');
	modaldialog.classList.add('slide-center-to-right');
	modalSignUp.hideModal();
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

function openModalTournamentMatchCreation() {
	modalPlay.hideModal();

	modalTournamentMatchCreation = new ModalManager('modalTournamentMatchCreation');

	var modaldialog = document.getElementById('modalTournamentCreationDialog');
	modaldialog.classList.add('grow-top-down');
	initTournamentCreation();
	modalTournamentMatchCreation.showModal();
}

function hideModalTournamentMatchCreation() {
	var modaldialog = document.getElementById('modalTournamentCreationDialog');
	modaldialog.classList.remove('grow-top-down');
	modalTournamentMatchCreation.hideModal();
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
		addFocusOutListener();
		// hidePlayer2ConnectionSection();
		// initBoxs();
		hideModal1v1MatchCreation();
	}
	else if (source === 'TournamentMatchCreation') {
		hideModalTournamentMatchCreation();
	}
	modalPlay.showModal();
}

// 

function openModalEditProfile() {
	modalEditProfile = new ModalManager('modal-edit-profile');

	var modaldialog = document.getElementById('modal-edit-profile-dialog');
	modaldialog.classList.add('grow-bottom-right');
	clear_edp_user_inputs();
	clear_edp_user_error_fields(true);
	clear_edp_pass_error_fields();
	button_dfa.disabled = true;
	get_2fa_state().then(() => {
		button_dfa.disabled = false;
		is_btn_on_enable ? set_to_disable_2fa_button() : set_to_enable_2fa_button();
	});
	modalEditProfile.showModal();
}

function closeModalEditProfile() {
	var modaldialog = document.getElementById('modal-ia-match-creation-dialog');
	modaldialog.classList.remove('grow-bottom-right');
	modalEditProfile.hideModal();
}

function keypressModalEditProfile(event) {
	if (event.key === 'Enter') {
		// const offcanvas = new bootstrap.Offcanvas(document.getElementById('menuProfile'));
		// offcanvas.toggle();
		// offcanvas.hide();
		// console.log(offcanvas);
		openModalEditProfile();
	}
}

//

function openModalProfile() {

	modalProfile = new ModalManager('modal-profile');

	var modaldialog = document.getElementById('modal-profile-dialog');
	modaldialog.classList.add('grow-bottom-right');
	modalProfile.showModal() 
	on_click_tab_history(document.getElementsByClassName("prof-tab-text")[0]);
}

function hideModalProfile() {
	var modaldialog = document.getElementById('modal-profile-dialog');
	modaldialog.classList.remove('grow-bottom-right');
	modalProfile.hideModal();
}

//

function openModalTwoFASetup() {

	modalTwoFASetup = new ModalManager('modal-2fa-setup');

	var modaldialog = document.getElementById('modal-2fa-setup-dialog');
	modaldialog.classList.add('grow-bottom-right');

	clear_code_inputs_setup();
	modalTwoFASetup.showModal();
	on_click_div_event(document.getElementById("tfas-key-enter-div"));
}

function hideModalTwoFASetup() {
	var modaldialog = document.getElementById('modal-2fa-setup-dialog');
	modaldialog.classList.remove('grow-bottom-right');
	modalTwoFASetup.hideModal();
}

function openModalTwoFAValid() {

	modalTwoFAValid = new ModalManager('modal-2fa-valid');

	var modaldialog = document.getElementById('modal-2fa-valid-dialog');
	modaldialog.classList.add('grow-bottom-right');
	
	clear_code_inputs_valid();
	modalTwoFAValid.showModal();
	on_click_div_event(document.getElementById("tfav-key-enter-div"));
}

function hideModalTwoFAValid() {
	var modaldialog = document.getElementById('modal-2fa-valid-dialog');
	modaldialog.classList.remove('grow-bottom-right');
	modalTwoFAValid.hideModal();
}


// FETCH MODALS
// Will load all the html modal files
async function get_modals_html()
{
	try
	{
		let [play_menu, login, register, solo_ai_menu, versus_menu, edit_profile, profile, twoFA_setup, twoFA_valid] =
		await Promise.all([
			fetch('modal_contents/play_menu/play_menu.html'),
			fetch('modal_contents/login/login.html'),
			fetch('modal_contents/register/register.html'),
			fetch('modal_contents/solo_ai_menu/solo_ai_menu.html'),
			fetch('modal_contents/versus_menu/versus_menu.html'),
			fetch('modal_contents/edit_profile/edit_profile.html'),
			fetch('modal_contents/profile/profile.html'),
			fetch('modal_contents/twoFA/twoFA_setup.html'),
			fetch('modal_contents/twoFA/twoFA_valid.html')
		]);
		
		[play_menu, login, register, solo_ai_menu, versus_menu, edit_profile, profile, twoFA_setup, twoFA_valid] =
		await Promise.all([
			play_menu.text(),
			login.text(),
			register.text(),
			solo_ai_menu.text(),
			versus_menu.text(),
			edit_profile.text(),
			profile.text(),
			twoFA_setup.text(),
			twoFA_valid.text()
		]);
		return play_menu + login + register + solo_ai_menu + versus_menu + edit_profile + profile + twoFA_setup + twoFA_valid;
	}
	catch (error)
	{
		console.log("Error retrieving static modal code.");
		return "";
	}
}

document.addEventListener("DOMContentLoaded", function()
{
	const event = new Event("onModalsLoaded");

	load_side_menu_html().then(() => {

		get_modals_html().then((html) => {
			document.getElementById('modals').innerHTML = html;
		})
		.then(() =>
		{
			document.dispatchEvent(event);
			addFocusOutListener();
			updateUI();
		});
	});

});
