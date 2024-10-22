function clear_edp_pass_error_fields()
{
	for (field in edp_placeholders_pass)
	{
		edp_placeholders_pass[field].style.border = "thin solid black";
		edp_placeholders_pass[field].value = "";
		edp_placeholders_pass[field].parentNode.children[2].innerHTML = "";
	}
}

function error_update_password_from_back(data)
{
	if (!data.data) // api 42 changed password, not allowed
	{
		create_popup("42 api users can not change password.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
		return ;
	}
	data = data.data;
	clear_edp_pass_error_fields();
	for (field in data)
	{
		edp_placeholders_pass[field].parentNode.children[1].style.border = "thin solid red";
		for (message of data[field])
			edp_placeholders_pass[field].parentNode.children[2].innerHTML += message + "<br />";
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
		if (fetched_data.status == 400)
		{
			error_update_password_from_back(data);
			return ;
		}
		data = data.data;
		create_popup("Password updated.", 4000, 4000, HEX_GREEN, HEX_GREEN_HOVER);
		clear_edp_pass_error_fields(edp_placeholders_pass);
		return ;
	}
	catch (error)
	{
		create_popup("Error while updating password.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
		return ;
	}
}

let edp_placeholders_pass = undefined;


document.addEventListener("onModalsLoaded", function()
{
	edp_placeholders_pass = {
		old_password: document.getElementById("edp-input-cur-password"),
		password: document.getElementById("edp-input-new-password"),
		password2: document.getElementById("edp-input-confirm-password"),
		non_field_errors: document.getElementById("edp-input-new-password")
	}
	let form_pass = document.getElementById("edp-form-password");
	change_form_behavior_for_SPA(form_pass, submit_pass_form);
});
