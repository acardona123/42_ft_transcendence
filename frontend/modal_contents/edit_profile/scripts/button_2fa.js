function set_to_disable_2fa_button()
{
	button_dfa.textContent = "Disable";
	button_dfa.className = "btn btn-danger";
	button_dfa.disabled = false;
}

function set_to_enable_2fa_button()
{
	button_dfa.textContent = "Enable";
	button_dfa.className = "btn btn-success";
	button_dfa.disabled = false;
}

function toggle_2fa_button()
{
	if (button_dfa.textContent == "Enable")
		set_to_disable_2fa_button();
	else
		set_to_enable_2fa_button()
}

function set_waiting_initial_fetch()
{
	button_dfa.textContent = "- - - -";
	button_dfa.className = "btn btn-secondary";
	button_dfa.disabled = true;
}

function open_2fa_setup_page(data)
{
	document.getElementById("tfas-qrcode-img").src = data.qrcode;
	document.getElementById("tfas-qrcode-key").textContent = data.code;
	closeModalEditProfile();
	openModalTwoFASetup();
}

async function enable_2fa(should_enable)
{
	const url = "https://localhost:8443/api/users/update/2fa/";
	const body = JSON.stringify({
		"2fa_status" : (should_enable ? "on" : "off")
	});
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'PUT',
			headers: {'content-type': 'application/json'},
			body: body
		});
		if (!fetched_data.ok)
			throw new Error("Error while enabling 2fa.");
		let data = await fetched_data.json();
		data = data.data;
		if (should_enable)
			open_2fa_setup_page(data);
		else
			toggle_2fa_button();
	}
	catch (error)
	{
		create_popup("Error while enabling 2fa.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
		return ;
	}
}

function send_dfa_change()
{
	if (is_btn_on_enable)
	{
		stop_click_on_all_page = true;
		enable_2fa(true).then(() =>
		{
			is_btn_on_enable = false;
			stop_click_on_all_page = false;
			button_dfa.disabled = false;
		});
		button_dfa.disabled = true;
	}
	else
	{
		stop_click_on_all_page = true;
		enable_2fa(false).then(() =>
		{
			is_btn_on_enable = true;
			set_to_enable_2fa_button();
			stop_click_on_all_page = false;
			button_dfa.disabled = false;
		});
		button_dfa.disabled = true;
	}
}

let is_btn_on_enable = false;
let button_dfa = undefined;

document.addEventListener("onModalsLoaded", function()
{
	button_dfa = document.getElementById("edp-button-2fa");
	set_to_enable_2fa_button();

	// fetch the actual state of the button
	is_btn_on_enable = true; // tmp

	button_dfa.onclick = send_dfa_change;
});
