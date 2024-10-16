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
	closeModalLogin();
	openModalTwoFAValid();
}

async function apply_login_user(refresh, access, username)
{
	sessionStorage.setItem("refresh_token", refresh);
	sessionStorage.setItem("access_token", access);

	await Promise.all([
		get_friend_list(),
		get_friends_request_list(),
		create_user_infos(username)
	]);
	updateUI();
}

function logout_user_no_back()
{
	sessionStorage.removeItem("refresh_token");
	sessionStorage.removeItem("access_token");
	global_user_infos = undefined;
	updateUI();
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
		if (!fetched_data.ok)
			throw new Error("Error while disconnecting.");
		logout_user_no_back();
	}
	catch (error)
	{
		create_popup("Error while disconnecting.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
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
			closeModalLogin();
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

document.addEventListener("onModalsLoaded", function()
{
	const form = document.getElementById("login-inputs-form");
	change_form_behavior_for_SPA(form, send_form_login);
});
