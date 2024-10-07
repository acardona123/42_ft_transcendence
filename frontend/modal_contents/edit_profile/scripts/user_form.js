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

function clear_input_errors(elements_ids)
{
	for (elem of elements_ids)
	{
		elem = document.getElementById(elem);
		if (elem.children.length != 0)
			elem.children[0].remove();
	}
}

function format_empty_values(body)
{
	if (!body.email)
		body.email = null;
	if (!body.phone)
		body.phone = null;
}

function submit_user_form(form)
{
	const body =
	{
		username : form["username"].value,
		email : form["email"].value,
		phone : form["phone"].value,
		pin : form["pin"].value
	}
	format_empty_values(body);
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

