function set_to_disable_button()
{
	button_dfa.textContent = "Disable";
	button_dfa.className = "btn btn-danger";
	button_dfa.disabled = false;
}

function set_to_enable_button()
{
	button_dfa.textContent = "Enable";
	button_dfa.className = "btn btn-success";
	button_dfa.disabled = false;
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
	hideModalTwoFASetup();
	openModalTwoFASetup();
}

async function enable_2fa()
{
	const url = "https://localhost:8443/api/users/update/2fa/";
	const body = JSON.stringify({
		"2fa_status" : "on"
	});

	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'PUT',
			headers: {'content-type': 'application/json'},
			body: body
		});
		if (!fetched_data.status.ok)
			throw new Error("Error while enabling 2fa.");
		let data = await fetched_data.json();
		data = data.data;
		open_2fa_setup_page(data);
	}
	catch (error)
	{
		// TODO: handle errors properly
		console.log(error);
		return ;
	}


}

function send_dfa_change()
{
	if (is_btn_on_enable)
	{
		enable_2fa().then(() =>
		{
			is_btn_on_enable = false;
			set_to_disable_button();
		});
		button_dfa.disabled = true;
	}
	else
	{
		diable_2fa();
		// fetch on back to disable the 2fa
		// simulation back response time
		delay(1000).then( () => {
			is_btn_on_enable = true;
			set_to_enable_button();
		});
		button_dfa.disabled = true;
	}
}

let is_btn_on_enable = false;
let button_dfa = undefined;

document.addEventListener("onModalsLoaded", function()
{
	button_dfa = document.getElementById("edp-button-2fa");
	set_to_enable_button();

	// fetch the actual state of the button
	is_btn_on_enable = true; // tmp

	button_dfa.onclick = send_dfa_change;
});
