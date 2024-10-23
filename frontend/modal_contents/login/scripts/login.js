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
	close_modal("modal-login", undefined, false);
	open_modal("modal-2fa-valid", init_modal_2fa_valid_bf, init_modal_2fa_valid_af, false);
}

async function apply_login_user(refresh, access)
{
	sessionStorage.setItem("refresh_token", refresh);
	sessionStorage.setItem("access_token", access);

	await Promise.all([
		get_friend_list(),
		create_user_infos()
	]);
	if (global_user_infos.is_oauth === true)
		set_oauth_2fa_button();
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
	if (modal_on_screen)
		close_modal(modal_on_screen, undefined, false); // TODO: edge case game
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
			await apply_login_user(data.refresh, data.access);
			close_modal("modal-login", undefined, false);
		}
		else
		{
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

async function auto_login_42()
{
	const params = new URLSearchParams(window.location.search);
	const code = params.get('code');
	const state = params.get('state');
	
	if (!code || !state)
		return;
	window.history.replaceState({}, document.title, '/');
	const url = "https://localhost:8443/api/users/login/api42/" + "?" + new URLSearchParams({
		code: code,
		state: state,
	}).toString();
	try
	{
		let fetched_data = await fetch(url, {
			method: 'GET'
		});
		if (!fetched_data.ok)
			throw new Error("Error while connecting to api 42.");
		data_json = await fetched_data.json();
		sessionStorage.setItem("access_token", data_json.data.tokens.access);
		sessionStorage.setItem("refresh_token", data_json.data.tokens.refresh);
	}
	catch (error)
	{
		return ;
	}
}

async function auto_login()
{
	// try to connect with 42 after 42 redirection
	await auto_login_42();
	// refresh token are set either by 42 or were still in local storage (reload)
	const refresh_token = sessionStorage.getItem("refresh_token");
	const access_token = sessionStorage.getItem("access_token");
	// no 42 redirect or refresh, nobody to auto login
	if (!refresh_token || !access_token)
	{
		update_ui();
		return ;
	}
	try
	{
		await apply_login_user(refresh_token, access_token);
	}
	catch (error)
	{
		// nothing to do on error, this is a intended silent error
	}
}

async function login_with_42()
{
	const url = "/api/users/url/api42/";
	fetch(url, {
		method: 'GET'
	})
	.then((fetched_data) =>
	{
		fetched_data.json()
		.then((data_json) => {
			window.location.href = data_json.data;
		});
	})
}

document.addEventListener("onModalsLoaded", function()
{
	const form = document.getElementById("login-inputs-form");
	change_form_behavior_for_SPA(form, send_form_login);
	auto_login();
});
