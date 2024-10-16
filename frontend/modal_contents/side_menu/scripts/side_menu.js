function update_side_menu()
{
	document.getElementById('menuProfile').innerHTML =
		is_connected() ? connected_sm_html : disconnected_sm_html;
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
		console.log(error);
	}
}
