let username_is_visible = true;
let password_is_visible = false;
let username_collapse_obj;
let password_collapse_obj;

function username_collapse()
{
	if (password_is_visible)
	{
		password_is_visible = false;
		password_collapse_obj.hide();
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
	password_is_visible = !password_is_visible;
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

function create_input_error(input_element_id, error_message)
{
	const elem_parent = document.getElementById(input_element_id);
	const new_text_elem = document.createElement('p');

	new_text_elem.textContent = error_message;
	new_text_elem.style.color = "red";
	new_text_elem.style.margin = "0px";
	new_text_elem.style.fontSize = "13px";

	elem_parent.appendChild(new_text_elem);
}

function pre_verification_front_user(body)
{
	let cancel_submit = false;
	clear_input_errors(["edp-text-username","edp-text-pin"]);

	if (body.username.length == 0)
	{
		cancel_submit = true;
		create_input_error("edp-text-username", "Username must not be empty.");
	}
	if (body.pin.length == 0)
	{
		cancel_submit = true;
		create_input_error("edp-text-pin", "Pin code must not be empty.");
	}
	return !cancel_submit;
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

	if (!pre_verification_front_user(body))
		return;
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

	let form_user = document.getElementById("edp-form-user");

	change_form_behavior_for_SPA(form_user, submit_user_form);
	
	document.getElementById("edp-informations-edit-text").onclick = username_collapse;
	document.getElementById("edp-password-edit-text").onclick = password_collapse;
});

