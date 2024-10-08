function error_password_from_back(data)
{
	// TODO: errors on front
	if (!data.data) // api 42 changed password, not allowed
	{
		console.log(data.message);
		return ;
	}
	data = data.data;
	for (field in data)
	{
		for (msg of data[field])
			console.log(msg);
	}
}

async function submit_pass_form(form)
{
	const body = JSON.stringify({
		old_password : form["cur_pass"].value,
		password : form["new_pass"].value,
		password2 : form["conf_pass"].value
	});
	const url = "https://localhost:8443/api/users/update/password/";

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
		console.log(data);
		if (fetched_data.status == 400)
		{
			error_password_from_back(data);
			return ;
		}
		data = data.data;
		console.log("Password updated.");
		return ;
		
		// TODO: popups, clear inputs
	}
	catch (error)
	{
		// TODO: handle errors properly
		console.log(error);
		return ;
	}
}

document.addEventListener("onModalsLoaded", function()
{
	let form_pass = document.getElementById("edp-form-password");
	// 42 api can't update password
	change_form_behavior_for_SPA(form_pass, submit_pass_form);
});
