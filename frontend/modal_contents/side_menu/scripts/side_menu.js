function reset_to_connect_state_side_menu()
{
	document.getElementById('menuProfile').innerHTML =
		is_connected() ? connected_sm_html : disconnected_sm_html;
}

function on_eye_pin_click_down(event)
{
	event.preventDefault();
	event.target.src = "./modal_contents/side_menu/img/pin-eye-close.png";
	document.getElementById("smc-pin-text").type = "text";
}

function on_eye_pin_click_up(event)
{
	event.preventDefault();
	event.target.src = "./modal_contents/side_menu/img/pin-eye-open.png";
	document.getElementById("smc-pin-text").type = "password";
}

let disconnected_sm_html = undefined;
let connected_sm_html = undefined;

async function load_side_menu_html()
{
	const side_connected_path = 'modal_contents/side_menu/menuConnected.html';
	const side_disconnected_path = 'modal_contents/side_menu/menuDisconnected.html';
	try
	{
		let [fetched_connected, fetched_disconnected] =
			await Promise.all([
				fetch(side_connected_path),
				fetch(side_disconnected_path)
			]);
		let [connected_sm_html_lcl, disconnected_sm_html_lcl] =
			await Promise.all([
				fetched_connected.text(),
				fetched_disconnected.text()
			]);
			disconnected_sm_html = disconnected_sm_html_lcl;
			connected_sm_html = connected_sm_html_lcl;
	}
	catch (error)
	{
		create_popup("Error loading side menu.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
	}
}
