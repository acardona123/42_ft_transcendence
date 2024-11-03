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

function clear_register_error_fields()
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
	for (field in placeholders)
	{
		placeholders[field].previousElementSibling.children[1].style.border = "thin solid var(--dark-purple)";
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
	clear_register_error_fields();
	let has_error = false;
	for (field in data)
	{
		has_error = true;
		placeholders[field].previousElementSibling.children[1].style.border = "thin solid red";
		for (message of data[field])
			placeholders[field].innerHTML += message + "<br />";
	}
	if (!has_error)
	{
		create_popup("Error signing up.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
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
	let button_register = document.getElementById("register-button");
	button_register.disabled = true;
	const url = "/api/users/signup/";
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
			button_register.disabled = false;
			return ;
		}
		await apply_login_user(data.tokens.refresh, data.tokens.access);
		close_modal("modal-register", undefined, false);
	}
	catch (error)
	{
		create_popup(error, 4000, 4000, HEX_RED, HEX_RED_HOVER);
	}
	button_register.disabled = false;
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
