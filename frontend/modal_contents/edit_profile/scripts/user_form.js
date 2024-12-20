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

function edp_allow_only_digits(event)
{
	if (!regex_digit.test(event.key) && event.key != "Backspace" && event.key != "Enter")
		event.preventDefault();
}

function clear_edp_user_error_fields(should_clear_inputs)
{
	for (field in edp_placeholders_user)
	{
		edp_placeholders_user[field].style.border = "thin solid var(--dark-purple)";
		edp_placeholders_user[field].parentNode.children[2].innerHTML = "";
		if (should_clear_inputs)
			edp_placeholders_user[field].value = "";
	}
}

function error_update_user_from_back(data)
{
	data = data;
	clear_edp_user_error_fields(false);
	for (field in data)
	{
		edp_placeholders_user[field].parentNode.children[1].style.border = "thin solid red";
		for (message of data[field])
			edp_placeholders_user[field].parentNode.children[2].innerHTML += message + "<br />";
	}
}

async function get_user_information()
{
	const url = "/api/users/info/";

	let fetched_data = await fetch_with_token(url, 
	{
		method: 'GET',
		headers: {}
	});
	if (!fetched_data.ok)
		throw new Error("Error retrieving user infos");
	let data = await fetched_data.json();
	data = data.data;
	global_user_infos =
	{
		username : data.username,
		profile_picture : data.profile_picture,
		pin : data.pin,
		is_oauth : data.is_oauth
	};
	return data;
}

function clear_edp_user_inputs()
{
	const save_button = document.getElementById("edp-save-information-button");
	save_button.disabled = true;
	for (field in edp_placeholders_user)
	{
		edp_placeholders_user[field].value = "";
		edp_placeholders_user[field].disabled = true;
	}
}
	
async function edp_update_user_info()
{
	const save_button = document.getElementById("edp-save-information-button");
	try
	{
		let infos = await get_user_information();
		save_button.disabled = false;
		for (field in edp_placeholders_user)
		{
			if (infos[field] === undefined)
				continue;
			edp_placeholders_user[field].value = infos[field];
			edp_placeholders_user[field].disabled = false;
		}
		if (infos.is_oauth)
		{
			document.getElementById("edp-button-submit-pass").disabled = true;
			set_oauth_2fa_button()
		}
		else
		{
			infos.is_2fa_enable ? set_enable_2fa_button() : set_disable_2fa_button();
			is_btn_enable = infos.is_2fa_enable;
			document.getElementById("edp-button-submit-pass").disabled = false;
		}
	}
	catch(error)
	{
		create_popup("Error retrieving user information.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
	}
}

function format_empty_values(body)
{
	if (!body.email)
		body.email = null;
	if (!body.phone)
		body.phone = null;
	return body;
}

function check_form_pin(pin)
{
	if (!pin || pin.value.length != 4)
	{
		error_update_user_from_back({pin: ["Pin code must be 4 digits long."]});
		return false;
	}
	return true;
}

async function submit_user_form(form)
{
	if (!check_form_pin(form["pin"]))
		return ;
	let body = JSON.stringify(format_empty_values({
		username : form["username"].value,
		email : form["email"].value,
		phone : form["phone"].value,
		pin : form["pin"].value,
		refresh : sessionStorage.getItem("refresh_token")
	}));
	const url = "/api/users/update/user/";
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'PUT',
			headers: {'content-type': 'application/json'},
			body: body
		});
		if (!fetched_data.ok && fetched_data.status != 400)
			throw new Error("Error while updating information.");
		let data = await fetched_data.json();
		data = data.data;
		if (fetched_data.status == 400)
		{
			error_update_user_from_back(data);
			return ;
		}
		clear_edp_user_error_fields(false);
		create_popup("Information updated.", 4000, 4000, HEX_GREEN, HEX_GREEN_HOVER);
		sessionStorage.setItem("refresh_token", data.refresh);
		sessionStorage.setItem("access_token", data.access);
		global_user_infos.username = data.username;
		global_user_infos.pin = data.pin;
		update_user_name();
		update_pin();
		return ;
	}
	catch (error)
	{
		create_popup("Error while updating information.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
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

let edp_placeholders_user = undefined;

document.addEventListener("onModalsLoaded", function()
{
	username_collapse_obj = new bootstrap.Collapse(document.getElementById(
		'edp-information-edit-collapse-div'), {toggle: false});
	password_collapse_obj = new bootstrap.Collapse(document.getElementById(
		'edp-password-edit-collapse-div'), {toggle: false});
	dfa_collapse_obj = new bootstrap.Collapse(document.getElementById(
		'edp-2fa-edit-collapse-div'), {toggle: false});

	edp_placeholders_user = {
		username: document.getElementById("edp-input-username"),
		email: document.getElementById("edp-input-email"),
		phone: document.getElementById("edp-input-phone"),
		pin: document.getElementById("edp-input-pin"),
		non_field_errors: document.getElementById("edp-input-username")
	}

	let form_user = document.getElementById("edp-form-user");

	change_form_behavior_for_SPA(form_user, submit_user_form);
	
	document.getElementById("edp-information-edit-text").onclick = username_collapse;
	document.getElementById("edp-password-edit-text").onclick = password_collapse;
	document.getElementById("edp-2fa-edit-text").onclick = dfa_collapse;
	document.getElementById("edp-input-pin").onkeydown = edp_allow_only_digits;
});

