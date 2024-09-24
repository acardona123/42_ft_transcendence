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

function submit_user_form(form)
{
	let cancel_submit = false;
	const body =
	{
		username : form["username"].value,
		email : form["email"].value,
		phone : form["phone"].value,
		pin : form["pin"].value
	}
	if (!body.username)
	{
		cancel_submit = true;
		create_input_error("text-username", "Username must not be empty.");
	}
	
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