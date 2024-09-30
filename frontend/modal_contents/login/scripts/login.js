function change_form_behavior_for_SPA(form, new_function)
{
	form.addEventListener('submit', (event) =>
	{
		event.preventDefault();
		new_function(form);
	});
}

function send_form_login(form)
{
	const body = {
		username: form["username"].value,
		password: form["password"].value,
	};
}

const form = document.getElementById("login-inputs-form");
change_form_behavior_for_SPA(form, send_form_login);