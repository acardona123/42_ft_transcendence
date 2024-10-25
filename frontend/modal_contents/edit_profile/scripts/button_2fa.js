function set_oauth_2fa_button()
{
	button_dfa.disabled = true;
	button_dfa.classList.add('edp-button-2fa-oauth');
}

function set_enable_2fa_button()
{
	button_dfa.classList.remove('edp-button-2fa-oauth');
	button_dfa.disabled = false;
	button_dfa.checked = true;
}

function set_disable_2fa_button()
{
	button_dfa.classList.remove('edp-button-2fa-oauth');
	button_dfa.disabled = false;
	button_dfa.checked = false;
}

function toggle_2fa_button()
{
	if (is_btn_enable == false)
		set_enable_2fa_button();
	else
		set_disable_2fa_button();
	is_btn_enable = !is_btn_enable
}

function set_waiting_initial_fetch()
{
	button_dfa.disabled = true;
}

function open_2fa_setup_page(data)
{
	document.getElementById("tfas-qrcode-img").src = data.qrcode;
	document.getElementById("tfas-qrcode-key").textContent = data.code;
	close_modal("modal-edit-profile", undefined, false);
	open_modal("modal-2fa-setup", init_modal_2fa_setup_bf, init_modal_2fa_setup_af, false);
}

async function get_2fa_state()
{
	const url = "https://localhost:8443/api/users/update/2fa/";
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'GET',
			headers: {}
		});
		if (!fetched_data.ok)
			throw new Error("Error fetching 2fa status.");
		let data = await fetched_data.json();
		data = data.data;
		return data["2fa_status"] == "on" ? true : false;
	}
	catch (error)
	{
		create_popup("Error fetching 2fa status.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
		return false;
	}
}

async function enable_2fa(should_enable)
{
	const url = "https://localhost:8443/api/users/update/2fa/";
	const body = {
		"2fa_status" : (should_enable ? "on" : "off")
	};
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'PUT',
			headers: {'content-type': 'application/json'},
			body: JSON.stringify(body)
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
	if (!is_btn_enable)
	{
		stop_click_on_all_page = true;
		button_dfa.disabled = true;
		enable_2fa(true).then(() =>
		{
			stop_click_on_all_page = false;
			button_dfa.disabled = false;
		});
	}
	else
	{
		stop_click_on_all_page = true;
		button_dfa.disabled = true;
		enable_2fa(false).then(() =>
		{
			stop_click_on_all_page = false;
			button_dfa.disabled = false;
		});
	}
}

let is_btn_enable = false;
let button_dfa = undefined;

document.addEventListener("onModalsLoaded", function()
{
	button_dfa = document.getElementById("edp-button-2fa");
	set_waiting_initial_fetch();
	button_dfa.onclick = send_dfa_change;
});
