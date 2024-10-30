let modal_login = undefined;
let modal_register = undefined;
let modal_play = undefined;
let modal_ia_match_creation = undefined;
let modal_versus_match_creation = undefined;
let modal_tournament_creation = undefined;
let modal_game = undefined;
let modal_edit_profile = undefined;
let modal_profile = undefined;
let modal_2fa_setup = undefined;
let modal_2fa_valid = undefined;
let modal_tournament_round_program = undefined;
let modal_tournament_guests_repartition = undefined;


let modal_on_screen = undefined;

let global_game_modal = undefined;

function init_modals()
{
	modal_login = new bootstrap.Modal(document.getElementById('modal-login'), {backdrop : "static", keyboard : false});
	modal_register = new bootstrap.Modal(document.getElementById('modal-register'), {backdrop : "static", keyboard : false});
	modal_play = new bootstrap.Modal(document.getElementById('modal-play'), {backdrop : "static", keyboard : false});
	modal_ia_match_creation = new bootstrap.Modal(document.getElementById('modal-ia-match-creation'), {backdrop : "static", keyboard : false});
	modal_versus_match_creation = new bootstrap.Modal(document.getElementById('modal-versus-match-creation'), {backdrop : "static", keyboard : false});
	modal_tournament_creation = new bootstrap.Modal(document.getElementById('modal-tournament-creation'), {backdrop : "static", keyboard : false});
	modal_game = new bootstrap.Modal(document.getElementById('modal-game'), {backdrop : "static", keyboard : false});
	modal_edit_profile = new bootstrap.Modal(document.getElementById('modal-edit-profile'), {backdrop : "static", keyboard : false});
	modal_profile = new bootstrap.Modal(document.getElementById('modal-profile'), {backdrop : "static", keyboard : false});
	modal_2fa_setup = new bootstrap.Modal(document.getElementById('modal-2fa-setup'), {backdrop : "static", keyboard : false});
	modal_2fa_valid = new bootstrap.Modal(document.getElementById('modal-2fa-valid'), {backdrop : "static", keyboard : false});
	modal_tournament_round_program = new bootstrap.Modal(document.getElementById("modal-tournament-round-program"), {backdrop : "static", keyboard : false});
	modal_tournament_guests_repartition = new bootstrap.Modal(document.getElementById("modal-tournament-guests-repartition"), {backdrop : "static", keyboard : false});
	

	document.addEventListener("hidePrevented.bs.modal", (event) => 
	{
		event.preventDefault();
		if (event.target.id !== 'modal-game' 
			&& event.target.id != 'modal-tournament-round-program'
			&& event.target.id != 'modal-tournament-guests-repartition')
			close_modal(event.target.id, undefined, true);
	});
}

function enable_buttons_play()
{
	const buttons = document.querySelectorAll('.btn-play');
	buttons.forEach(button => {
		button.disabled = false;
	});
}

function disable_buttons_play()
{
	const buttons = document.querySelectorAll('.btn-play');
	buttons.forEach(button => {
		button.disabled = true;
	});
}

document.addEventListener('onModalsLoaded', init_modals);

function set_global_game_pong()
{
	global_game_modal = "PONG";
}

function set_global_game_flappy_bird()
{
	global_game_modal = "FLAPPYBIRD";
}

function focus_modal_login()
{
	document.getElementById("input-login-username").focus();
}

function focus_modal_register()
{
	document.getElementById("input-register-username").focus();
}

function init_modal_2fa_setup_bf()
{
	clear_code_inputs_setup();
}

function init_modal_2fa_setup_af()
{
	on_click_div_event(document.getElementById("tfas-key-enter-div"));
}

function init_modal_2fa_valid_bf()
{
	clear_code_inputs_valid();
}

function init_modal_2fa_valid_af()
{
	on_click_div_event(document.getElementById("tfav-key-enter-div"));
}

async function init_modal_profile_bf()
{
	await Promise.all([
		setup_friend_list(),
		setup_friends_request_list(),
		setup_history_matches_list(),
		update_statistics()
	]);
}

function init_modal_profile_af()
{
	on_click_tab_history(document.getElementsByClassName("prof-tab-text")[0]);
}

async function init_modal_edit_profile()
{
	clear_edp_user_inputs();
	clear_edp_user_error_fields(true);
	clear_edp_pass_error_fields();
	await edp_update_user_info();
	update_side_menu();
	edp_update_profile_picture();
}

async function init_modal_tournament_round_program(){
	tournament_round_display_loading_elements();
	await regenerate_round_elements();
	update_round_display();
}

async function init_modal_tournament_guests_repartition(){
	tournament_guests_repartition_loading_elements();
	await regenerate_guests_elements();
	update_guests_display();
}

async function open_modal(id_modal, init_function_bf=undefined, init_function_af=undefined, should_add_to_history=true)
{
	modal_on_screen = id_modal;

	if (init_function_bf !== undefined)
		await init_function_bf();

	switch (id_modal)
	{
		case "modal-login":
			modal_login.show();
			break;
		case "modal-register":
			modal_register.show();
			break;
		case "modal-play":
			modal_play.show();
			break;
		case "modal-ia-match-creation":
			modal_ia_match_creation.show();
			break;
		case "modal-versus-match-creation":
			modal_versus_match_creation.show();
			break;
		case "modal-tournament-creation":
			modal_tournament_creation.show();
			break;
		case "modal-game":
			modal_game.show();
			break;
		case "modal-edit-profile":
			modal_edit_profile.show();
			break;
		case "modal-profile":
			modal_profile.show();
			break;
		case "modal-2fa-setup":
			modal_2fa_setup.show();
			break;
		case "modal-2fa-valid":
			modal_2fa_valid.show();
			break;
		case "modal-tournament-round-program":
			modal_tournament_round_program.show();
			break;
		case "modal-tournament-guests-repartition":
			modal_tournament_guests_repartition.show();
			break;
		default:
			console.log("Error : this is not a id for modal.");
			return;
	}
	disable_buttons_play();
	if (init_function_af !== undefined)
		await init_function_af();

	if (should_add_to_history)
	{
		history.pushState({
			modal_id : id_modal,
			funcs : {bf : init_function_bf?.name, af : init_function_af?.name},
			open : true,
		}, null);
	}
}

function return_to_modal_play()
{
	modal_on_screen = "modal-play";
	modal_play.show();
}

function close_modal(id_modal, init_function_af, should_add_to_history=true)
{
	switch (id_modal)
	{
		case "modal-login":
			modal_login.hide();
			break;
		case "modal-register":
			modal_register.hide();
			break;
		case "modal-play":
			modal_play.hide();
			break;
		case "modal-ia-match-creation":
			modal_ia_match_creation.hide();
			break;
		case "modal-versus-match-creation":
			modal_versus_match_creation.hide();
			break;
		case "modal-tournament-creation":
			modal_tournament_creation.hide();
			break;
		case "modal-game":
			modal_game.hide();
		case "modal-edit-profile":
			modal_edit_profile.hide();
			break;
		case "modal-profile":
			modal_profile.hide();
			break;
		case "modal-2fa-setup":
			modal_2fa_setup.hide();
			break;
		case "modal-2fa-valid":
			modal_2fa_valid.hide();
			break;
		case "modal-tournament-round-program":
			modal_tournament_round_program.hide();
			break;
		case "modal-tournament-guests-repartition":
			modal_tournament_guests_repartition.hide();
			break;
		default:
			return;
	}
	enable_buttons_play();
	modal_on_screen = undefined;

	if (init_function_af !== undefined)
		init_function_af();
	if (should_add_to_history)
		history.pushState({modal_id : id_modal, open : false}, null);
}

// FETCH MODALS
// Will load all the html modal files
async function get_modals_html()
{
	try
	{
		let [play_menu, login, register, solo_ai_menu, versus_menu, tournament_menu, game, edit_profile, profile, twoFA_setup, twoFA_valid, tournament_round_program, tournament_guests_repartition] =
		await Promise.all([
			fetch('modal_contents/play_menu/play_menu.html'),
			fetch('modal_contents/login/login.html'),
			fetch('modal_contents/register/register.html'),
			fetch('modal_contents/solo_ai_menu/solo_ai_menu.html'),
			fetch('modal_contents/versus_menu/versus_menu.html'),
			fetch('modal_contents/tournament_menu/tournament_menu.html'),
			fetch('modal_contents/games/game.html'),
			fetch('modal_contents/edit_profile/edit_profile.html'),
			fetch('modal_contents/profile/profile.html'),
			fetch('modal_contents/twoFA/twoFA_setup.html'),
			fetch('modal_contents/twoFA/twoFA_valid.html'),
			fetch('modal_contents/tournament_round_program/tournament_round_program.html'),
			fetch('modal_contents/tournament_guests_repartition/tournament_guests_repartition.html'),
		]);
		
		[play_menu, login, register, solo_ai_menu, versus_menu, tournament_menu, game, edit_profile, profile, twoFA_setup, twoFA_valid, tournament_round_program, tournament_guests_repartition] =
		await Promise.all([
			play_menu.text(),
			login.text(),
			register.text(),
			solo_ai_menu.text(),
			versus_menu.text(),
			tournament_menu.text(),
			game.text(),
			edit_profile.text(),
			profile.text(),
			twoFA_setup.text(),
			twoFA_valid.text(),
			tournament_round_program.text(),
			tournament_guests_repartition.text()
		]);
		return play_menu + login + register + solo_ai_menu + versus_menu + tournament_menu + game + edit_profile + profile + twoFA_setup + twoFA_valid + tournament_round_program + tournament_guests_repartition;
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
			document.dispatchEvent(event);
			enable_buttons_play_event_offcanvas();
			addFocusOutListener();
		});
	});

});
