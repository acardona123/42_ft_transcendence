function pre_verification_front_pass(body)
{
	let cancel_submit = false;

	clear_input_errors(["text-cur-pass","text-new-pass", "text-confirm-pass"]);

	if (body.current_password.length == 0)
	{
		create_input_error("text-cur-pass", "Current password must not be empty.");
		cancel_submit = true;
	}
	if (body.new_password.length == 0)
	{
		create_input_error("text-new-pass", "New password must not be empty.");
		cancel_submit = true;
	}
	if (body.confirm_password.length == 0)
	{
		create_input_error("text-confirm-pass", "Confirm password must not be empty.");
		cancel_submit = true;
	}
	return !cancel_submit;
}


function submit_pass_form(form)
{
	const body =
	{
		current_password : form["cur_pass"].value,
		new_password : form["new_pass"].value,
		confirm_password : form["conf_pass"].value
	};

	if (!pre_verification_front_pass(body))
		return;
}


let form_pass = document.getElementById("form-password");

change_form_behavior_for_SPA(form_pass, submit_pass_form);