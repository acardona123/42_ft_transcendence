let username_is_visible = true;
let password_is_visible = false;
let username_collapse_obj = new bootstrap.Collapse(document.getElementById(
	'information-edit-collapse-div'), {toggle: false});
let password_collapse_obj = new bootstrap.Collapse(document.getElementById(
	'password-edit-collapse-div'), {toggle: false});

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

function pre_verification_front(body)
{
	let cancel_submit = false;

	if (!body.passwordame)
	{
		cancel_submit = true;
		create_input_error("text-username", "Username must not be empty.");
	}
	return cancel_submit;
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

	if (!pre_verification_front(cancel_submit))
		return;

}

function change_form_behavior_for_SPA(form)
{
	form.addEventListener('submit', (event) =>
	{
		event.preventDefault();
		submit_user_form(form);
	});
}

let form = document.getElementById("form-user");

change_form_behavior_for_SPA(form);

document.getElementById("informations-edit-text").onclick = username_collapse;
document.getElementById("password-edit-text").onclick = password_collapse;