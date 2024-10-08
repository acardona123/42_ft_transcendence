let username_is_visible = true;
let password_is_visible = false;
let dfa_is_visible = false;
let username_collapse_obj;
let password_collapse_obj;
let dfa_collapse_obj;

function username_collapse()
{
	if (password_is_visible)
	{
		password_is_visible = false;
		password_collapse_obj.hide();
	}
	if (dfa_is_visible)
	{
		dfa_is_visible = false;
		dfa_collapse_obj.hide();
	}
	username_is_visible = !username_is_visible;
}

function password_collapse()
{
	if (username_is_visible)
	{
		username_is_visible = false;
		username_collapse_obj.hide();
	}
	if (dfa_is_visible)
	{
		dfa_is_visible = false;
		dfa_collapse_obj.hide();
	}
	password_is_visible = !password_is_visible;
}

function dfa_collapse()
{
	if (username_is_visible)
	{
		username_is_visible = false;
		username_collapse_obj.hide();
	}
	if (password_is_visible)
	{
		password_is_visible = false;
		password_collapse_obj.hide();
	}
	dfa_is_visible = !dfa_is_visible;
}

function format_empty_values(body)
{
	if (!body.email)
		body.email = null;
	if (!body.phone)
		body.phone = null;
	return body;
}

function error_update_user_from_back(data)
{
	// TODO: errors on front
	for (field in data)
	{
		for (msg of data[field])
			console.log(field + ": " + msg);
	}
}

async function submit_user_form(form)
{
	let body = JSON.stringify(format_empty_values({
		username : form["username"].value,
		email : form["email"].value,
		phone : form["phone"].value,
		pin : form["pin"].value
	}));
	const url = "https://localhost:8443/api/users/update/user/";
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'PUT',
			headers: {'content-type': 'application/json'},
			body: body
		});
		if (!fetched_data.ok && fetched_data.status != 400)
			throw new Error("Error while updating password.");
		let data = await fetched_data.json();
		data = data.data;
		if (fetched_data.status == 400)
		{
			error_update_user_from_back(data);
			return ;
		}
		console.log("Informations updated.");
		// TODO: popup
		return ;
	}
	catch (error)
	{
		// TODO: handle errors properly
		console.log(error);
		return ;
	}
}

function change_form_behavior_for_SPA(form, new_function)
{
	form.addEventListener('submit', (event) =>
	{
		event.preventDefault();
		new_function(form);
	});
}

document.addEventListener("onModalsLoaded", function()
{
	username_collapse_obj = new bootstrap.Collapse(document.getElementById(
		'edp-information-edit-collapse-div'), {toggle: false});
	password_collapse_obj = new bootstrap.Collapse(document.getElementById(
		'edp-password-edit-collapse-div'), {toggle: false});
	dfa_collapse_obj = new bootstrap.Collapse(document.getElementById(
		'edp-2fa-edit-collapse-div'), {toggle: false});

	let form_user = document.getElementById("edp-form-user");

	change_form_behavior_for_SPA(form_user, submit_user_form);
	
	document.getElementById("edp-informations-edit-text").onclick = username_collapse;
	document.getElementById("edp-password-edit-text").onclick = password_collapse;
	document.getElementById("edp-2fa-edit-text").onclick = dfa_collapse;
});

