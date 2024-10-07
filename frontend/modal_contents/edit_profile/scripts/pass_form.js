function submit_pass_form(form)
{
	const body =
	{
		current_password : form["cur_pass"].value,
		new_password : form["new_pass"].value,
		confirm_password : form["conf_pass"].value
	};
	// add back
}

document.addEventListener("onModalsLoaded", function()
{
	let form_pass = document.getElementById("edp-form-password");
	change_form_behavior_for_SPA(form_pass, submit_pass_form);
});
