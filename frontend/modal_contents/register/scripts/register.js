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

function clear_register_error_fields(placeholders)
{
	for (field in placeholders)
	{
		placeholders[field].previousElementSibling.children[1].style.border = "thin solid black";
		placeholders[field].textContent = "";
	}
}

function on_error_form_register(data)
{
	const placeholders = 
	{
		username: document.getElementById("register-on-error-username"),
		email: document.getElementById("register-on-error-email"),
		phone: document.getElementById("register-on-error-phone"),
		password: document.getElementById("register-on-error-password"),
		password2: document.getElementById("register-on-error-confirm_pass"),
		non_field_errors: document.getElementById("register-on-error-password")
	}
	clear_register_error_fields(placeholders);
	for (field in data)
	{
		placeholders[field].previousElementSibling.children[1].style.border = "thin solid red";
		for (message of data[field])
			placeholders[field].innerHTML += message + "<br />";
	}
}

async function send_form_register(form)
{
	const body = format_value_for_back({
		username: form["username"].value,
		password: form["password"].value,
		password2: form["confirm_pass"].value,
		email: form["email"].value,
		phone: form["phone"].value,
	});
	const url = "https://localhost:8443/api/users/signup/";
	try
	{
		let fetched_data = await fetch(url, {
			method: 'POST',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(body)
		});
		if (!fetched_data.ok && fetched_data.status != 400)
			throw new Error("Failed to register.");
		let data = await fetched_data.json();
		data = data.data;
		if (fetched_data.status == 400)
		{
			on_error_form_register(data);
			return ;
		}
		await apply_login_user(data.tokens.refresh, data.tokens.access, body.username);
		close_modal("modal-register");
	}
	catch (error)
	{
		create_popup(error, 4000, 4000, HEX_RED, HEX_RED_HOVER);
		return ;
	}

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
