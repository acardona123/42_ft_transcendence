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

function send_dfa_change()
{
	if (is_btn_on_enable)
	{
		// fetch on back to enable the 2fa
		// simulation back response time
		delay(1000).then( () => {
			is_btn_on_enable = false;
			set_to_disable_button();
		});
		button_dfa.disabled = true;
	}
	else
	{
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
