let popup_list = [];
const space_between_popups = 3; // in px

async function delay(ms)
{
	// console.log(ms)
	return new Promise(res => setTimeout(res, ms));
}

function update_all_popups_pos()
{
	popup_list.forEach((pop, index) =>
	{
		let pos = ((popup_list.length - 1) - index) * (pop.popup.getBoundingClientRect().height + space_between_popups);
		pop.popup.style.top = pos.toString() + "px";
	})
}

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
	update_all_popups_pos();
}

function popup_mouse_enter()
{
	const popup_id = popup_list.findIndex(p => p.popup === this);
	popup_list[popup_id].is_hover = true;
}

function popup_mouse_leave()
{
	const popup_id = popup_list.findIndex(p => p.popup === this);
	popup_list[popup_id].is_hover = false;
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
		inner_loop = true;
		should_redo = false;
		let delay_end = delay(2000);
		while (inner_loop)
		{
			delay_end.then(() => {inner_loop = false});
			if (popup_list[popup_id].is_hover)
				should_redo = true;
			await delay(100);
		}
	}
	popup_list[popup_id].popup.style.animationPlayState = "running";
}
