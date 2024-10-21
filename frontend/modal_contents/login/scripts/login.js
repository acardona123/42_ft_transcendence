let username_2fa_valid = undefined;
const DEFAULT_PP_PATH = "/media/profile_picture/default.jpg";

function change_form_behavior_for_SPA(form, new_function)
{
	form.addEventListener('submit', (event) =>
	{
		event.preventDefault();
		new_function(form);
	});
}

function send_user_to_2fa()
{
	close_modal("modal-login");
	open_modal("modal-2fa-valid", init_modal_2fa_valid_bf, init_modal_2fa_valid_af);
}

async function apply_login_user(refresh, access, username)
{
	sessionStorage.setItem("refresh_token", refresh);
	sessionStorage.setItem("access_token", access);

	await Promise.all([
		get_friend_list(),
		create_user_infos(username),
		get_2fa_state()
	]);
	button_dfa.disabled = false;
	is_btn_on_enable ? set_to_enable_2fa_button() : set_to_disable_2fa_button();
	update_ui();
}

function empty_globals()
{
	friend_list_data = undefined;
	clicked_once = false;
	lastReplacedElemFocus = undefined;
	lastReplacedElemHover = undefined;
	friend_popup_just_popped = false;
	data_requests = undefined;
	clicked_element = undefined;
	history_list = undefined;
	
	playerGrid = undefined;
	playerCards = undefined;
	btnAddGuestPlayer = undefined;
	btnAddConnectedPlayer = undefined;
	ToggleConnectedPlayerContainer = undefined;
	buttonAddIA = undefined;
	debugOutput = undefined;
	
	cardsNumber = 1;
	IANumber = 0;
	guestNumber = 0;
	playerNumber = 1;
	playerList = [];
}

function logout_user_no_back()
{
	sessionStorage.removeItem("refresh_token");
	sessionStorage.removeItem("access_token");
	global_user_infos = undefined;
	empty_globals();
	update_ui();
}

async function logout_user()
{
	const url = "https://localhost:8443/api/users/logout/";
	const body = JSON.stringify({
		refresh : sessionStorage.getItem("refresh_token")
	});
	try
	{
		let fetched_data = await fetch(url, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: body
		});
		logout_user_no_back();
		if (!fetched_data.ok)
			throw new Error("Error while disconnecting.");
	}
	catch (error)
	{
		// this is a normal silent error
		return ;
	}
}

function on_error_form_login(message)
{
	if (message == "No active account found with the given credentials")
		message = "Incorrect username or password";
	const div = document.getElementById("login-on-error-input-div");
	div.children[0].textContent = message;
	div.style.display = "initial";
}

async function send_form_login(form)
{
	form.children[2].disabled = true;
	const url = "https://localhost:8443/api/users/login/";
	const body = {
		username: form["username"].value,
		password: form["password"].value,
	};
	try
	{
		let fetched_data = await fetch(url, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(body)
		});
		form.children[2].disabled = false;
		if (!fetched_data.ok && fetched_data.status != 401)
			throw new Error("Error while login in.");
		let data = await fetched_data.json();
		if (fetched_data.status == 401)
		{
			on_error_form_login(data.message);
			return ;
		}
		data = data.data;
		if (data['2fa_status'] == "off")
		{
			await apply_login_user(data.refresh, data.access, body.username);
			username_2fa_valid = undefined;
			close_modal("modal-login");
		}
		else
		{
			username_2fa_valid = body.username;
			sessionStorage.setItem("access_token", data.access);
			send_user_to_2fa(data.access);
		}
	}
	catch (error)
	{
		create_popup("Error while login in.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
		return ;
	}
}

async function auto_login()
{
	const refresh_token = sessionStorage.getItem("refresh_token");
	const access_token = sessionStorage.getItem("access_token");
	if (!refresh_token || !access_token)
		return ;
	try
	{
		let user_infos = await get_user_informations();
		let picture = await get_profil_picture();

		if (picture == DEFAULT_PP_PATH)
			throw new Error ("Error while login in.");
		global_user_infos = {
			username: user_infos.username,
			profile_picture: picture,
			pin: user_infos.pin
		};
	}
	catch (error)
	{
		// nothing to do on error, this is a intended silent error
	}
}
document.addEventListener("onModalsLoaded", function()
{
	const form = document.getElementById("login-inputs-form");
	change_form_behavior_for_SPA(form, send_form_login);
	auto_login().then(() => 
	{
		update_ui();
	});
});
