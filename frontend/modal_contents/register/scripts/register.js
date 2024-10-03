function change_form_behavior_for_SPA(form, new_function)
{
	form.addEventListener('submit', (event) =>
	{
		event.preventDefault();
		new_function(form);
	});
}

function format_value_for_back(body)
{
	if (!body.email)
		body.email = null;
	if (!body.phone)
		body.phone = null;
	return body;
}

function send_form_register(form)
{
	const body = format_value_for_back({
		username: form["username"].value,
		email: form["email"].value,
		phone: form["phone"].value,
		password: form["password"].value,
		confirm_pass: form["confirm_pass"].value,
	})
}

document.addEventListener("onModalsLoaded", function()
{
	const list_inputs = document.getElementsByClassName("inputs-register");
	for (const input of list_inputs)
	{
		input.oninput = on_input_write_when_empty;
	}
	const form = document.getElementById("register-inputs-form");
	change_form_behavior_for_SPA(form, send_form_register);
});
