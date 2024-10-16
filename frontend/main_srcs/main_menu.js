function update_pp()
{
	const userImageElements = document.querySelectorAll('.userImage');
	userImageElements.forEach(userImageElement => {
		console.log("changed on " + (global_user_infos !== undefined) + " : ");
		console.log(userImageElement);
		userImageElement.src = (global_user_infos !== undefined) ? global_user_infos.profile_picture : defaultUserImage;
	});
}

async function update_side_menu()
{
	document.getElementById('menuProfile').innerHTML =
		(global_user_infos !== undefined) ? disconnected_sm_html : connected_sm_html;
}

// TODO: change (global_user_infos !== undefined) to a function

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
		let [disconnected_sm_html_lcl, connected_sm_html_lcl] =
			await Promise.all([
				fetched_connected.text(),
				fetched_disconnected.text()
			]);
			disconnected_sm_html = disconnected_sm_html_lcl;
			connected_sm_html = connected_sm_html_lcl;
		console.log("done");
	}
	catch (error)
	{
		console.log(error);
	}
}

function updateUI() {

	update_side_menu().then ( () => {
		update_pp();
		updateUserName();
	});
}

function updateUserName() {
	const userNameElements = document.querySelectorAll('.user-name');
	userNameElements.forEach(userNameElement => {
		userNameElement.textContent = global_user_infos?.username;
	});
}

function disableButtonPlay() {
	const buttonPlay = document.getElementById('buttonPlay');
	buttonPlay.disabled = true;

	document.getElementById("menuProfile").addEventListener('hide.bs.offcanvas', function () {
		buttonPlay.disabled = false;
		buttonPlay.focus();
	})
}
