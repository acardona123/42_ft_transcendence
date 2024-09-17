let popup_list = [];

const delay = ms => new Promise(res => setTimeout(res, ms));

function create_popup(text, time_before_decay, time_to_decay, hex_color)
{
	const popup_main = document.createElement('div');

	popup_main.className = "popup-main-div";
	// popup_main.id = "popup-" + popup_list.length.toString();
	popup_main.onanimationend = remove_popup;
	popup_main.onmouseenter = popup_mouse_enter;
	popup_main.onmouseleave = popup_mouse_leave;
	popup_id = popup_list.length;
	popup_list.push({popup : popup_main, is_hover : false});
	popup_handler(popup_id);
	document.body.appendChild(popup_main);
}

function popup_mouse_enter()
{
	const popup_id = popup_list.findIndex(p => p.popup === this);

	popup_list[popup_id].is_hover = true;
	console.log("set popup " + popup_id + " to true");
}

function popup_mouse_leave()
{
	const popup_id = popup_list.findIndex(p => p.popup === this);

	popup_list[popup_id].is_hover = false;
	console.log("set popup " + popup_id + " to false");
}

function remove_popup()
{
	this.remove();
}


async function popup_handler(popup_id)
{
	should_redo = true;
	while (should_redo)
	{
		should_redo = false;
		await delay(2000);
		while (popup_list[popup_id].is_hover)
		{
			await delay(100);
			should_redo = true;
			// console.log("is hovered !");
		}
	}
	console.log("fade");
	popup_list[popup_id].popup.style.animationPlayState = "running";
}

// test.style.transform = "translate(0px, 100px)";