function position_friend_popup(popup_add_friend)
{
	const add_friend_button = document.getElementById("add_friend_button");
	var rect = add_friend_button.getBoundingClientRect();

	const offsetX = rect.right + 10;
	const offsetY = rect.bottom - (popup_add_friend.bottom - popup_add_friend.top);

	popup_add_friend.style.left = offsetX.toString() + "px";
	popup_add_friend.style.top = offsetY.toString() + "px";
}

function fill_add_popup(popup_add_friend)
{
	const button_add = document.createElement('button');
	button_add.className = "add-friend-popup-button btn";
	button_add.textContent = "Confirm";
	button_add.onclick = send_friend_request;
	const input_text = document.createElement('input');
	input_text.className = "add-friend-pseudo-input";
	input_text.type = "text";
	input_text.id = "add_friend_pseudo_input";
	input_text.placeholder = "Pseudonyme";
	input_text.onkeydown = send_friend_request;
	popup_add_friend.appendChild(input_text);
	popup_add_friend.appendChild(button_add);
}

function show_friend_popup(event)
{
	if (event.key != "Enter" && event.key != null)
		return ;
	const popup_add_friend = document.createElement('div');
	popup_add_friend.id = "popup_add_friend";
	popup_add_friend.className = "popup-add-friend";
	popup_add_friend.style.zIndex = "1";
	popup_add_friend.onkeydown = remove_friends_popup;
	
	position_friend_popup(popup_add_friend);
	fill_add_popup(popup_add_friend);
	
	const friend_text_title = document.getElementById("friend-title");
	friend_text_title.appendChild(popup_add_friend);
	document.getElementById("add_friend_pseudo_input").focus();
	deactivate_friends_button();
}

function remove_friends_popup(event)
{
	if (event) // triggered by event keyboard
	{
		if (event.key != "Escape")
			return;
	}
	document.getElementById("popup_add_friend")?.remove();
	activate_friends_button();
}

function activate_friends_button()
{
	const elem = document.getElementById("add_friend_button");
	elem.onclick = show_friend_popup;
	elem.onkeydown = show_friend_popup;
	friend_popup_just_popped = true;
}

var friend_popup_just_popped = false;

function deactivate_friends_button()
{
	const elem = document.getElementById("add_friend_button");
	elem.onclick = null;
	elem.onkeydown = null;
	friend_popup_just_popped = true;
}

function onWindowResize()
{
	const popup_add_friend = document.getElementById("popup_add_friend");
	if (popup_add_friend != null)
		position_friend_popup(popup_add_friend);
}

function onWindowClick(event)
{
	if (friend_popup_just_popped)
	{
		friend_popup_just_popped = false;
		return;
	}
	if (!document.getElementById("popup_add_friend")?.contains(event.target))
		remove_friends_popup();
}

function send_friend_request(event)
{
	if (event.type == "keydown")
	{
		if (event.key != "Enter")
			return;
	}
	const input_zone = document.getElementById("add_friend_pseudo_input")
	// send JSON to the back
	// JSON.stringify({"pseudo" : input_zone.value});
	
	remove_friends_popup();
}

window.onresize = onWindowResize;
const elem = document.getElementById("add_friend_button");
elem.onclick = null;
window.addEventListener('click', onWindowClick);
activate_friends_button();