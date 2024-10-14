async function validate_code_setup(user_code)
{
	const url = "https://localhost:8443/api/users/update/2fa/validation/";
	const body = JSON.stringify ({
		token : user_code
	});
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'PUT',
			headers: {
				'content-type': 'application/json',
			},
			body: body
		});
		if (fetched_data.status == 400)
			return "invalid";
		else if (fetched_data.status == 401)
			return "expired";
		else if (!fetched_data.ok)
			throw new Error("Error validating the code.");
		toggle_2fa_button();
		hideModalTwoFASetup();
		openModalEditProfile();
		return "valid";
	}
	catch (error)
	{
		create_popup("Error validating the code.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
		return "invalid";
	}
}

async function validate_code_valid(user_code)
{
	const url = "https://localhost:8443/api/users/login/2fa/";
	const body = JSON.stringify ({
		token : user_code
	});
	try
	{
		let fetched_data = await fetch(url, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'Authorization' : "Bearer " + sessionStorage.getItem("access_token")
			},
			body: body
		});
		if (fetched_data.status == 400)
			return "invalid";
		else if (fetched_data.status == 401)
			return "expired";
		else if (!fetched_data.ok)
			throw new Error("Error validating the code.");
		let data = await fetched_data.json();
		data = data.data;
		apply_login_user(data.refresh, data.access);
		hideModalTwoFAValid();
		return "valid";
	}
	catch (error)
	{
		create_popup(error, 4000, 4000, HEX_RED, HEX_RED_HOVER);
		return "invalid";
	}
}

async function validate_code(user_code, is_setup)
{
	if (is_setup)
		return validate_code_setup(user_code);
	else
		return validate_code_valid(user_code);
}

async function send_code_to_validation(digit_inputs, is_setup)
{
	const code = digit_inputs[0].value
		+ digit_inputs[1].value + digit_inputs[2].value
		+ digit_inputs[3].value + digit_inputs[4].value
		+ digit_inputs[5].value;
	let validation_res;
	validation_res = await validate_code(code, is_setup)
	if (validation_res == "invalid")
	{
		animate_on_error(digit_inputs);
	}
	else if (validation_res == "expired")
	{
		if (is_setup)
		{
			hideModalTwoFASetup();
			openModalEditProfile();
		}
		else
		{
			hideModalTwoFAValid();
			openModalLogin();
		}
		create_popup("The session is expired.", 10000, 4000, HEX_RED, HEX_RED_HOVER);
	}
	else
		is_btn_on_enable = !is_btn_on_enable;
}
