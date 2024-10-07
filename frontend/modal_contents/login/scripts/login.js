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

function apply_login_user(refresh, access)
{
	sessionStorage.setItem("refresh_token", refresh);
	sessionStorage.setItem("access_token", access);
	isConnected = true;
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
		let fetched_data = await fetch_with_token(url, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: body
		});
		if (!fetched_data.ok)
			throw new Error("Error while disconnecting.");
		sessionStorage.removeItem("refresh_token");
		sessionStorage.removeItem("access_token");
		isConnected = false;
		updateUI();
	}
	catch (error)
	{
		// TODO: handle errors properly
		console.log(error);
		return ;
	}
}

async function send_form_login(form)
{
	const url = "https://localhost:8443/api/users/login/";
	const body = JSON.stringify({
		username: form["username"].value,
		password: form["password"].value,
	});
	try
	{
		let fetched_data = await fetch(url, {
			method: 'POST',
			headers: new Headers({'content-type': 'application/json'}),
			body: body
		});
		if (fetched_data.status == 401)
		{
			// error on credential wrong password
			return ;
		}
		else if (!fetched_data.ok)
			throw new Error("Error while login in.");
		let data = await fetched_data.json();
		data = data.data;
		if (data['2fa_status'] == "off")
		{
			apply_login_user(data.refresh, data.access);
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
		// TODO: handle errors properly
		console.log(error);
		return ;
	}
}

document.addEventListener("onModalsLoaded", function()
{
	const form = document.getElementById("login-inputs-form");
	change_form_behavior_for_SPA(form, send_form_login);
});