let popup_list = [];
const space_between_popups = 3; // in px

async function delay(ms, print)
{
	if (print)
		console.log(ms)
	return new Promise(res => setTimeout(res, ms));
}

function update_all_popups_pos(one_pop = undefined)
{
	popup_list.forEach((pop, index) =>
	{
		if (!pop.is_hover)
		{
			let pos = ((popup_list.length - 1) - index) * (pop.popup.getBoundingClientRect().height + space_between_popups);
			pop.popup.style.top = pos.toString() + "px";
		}
	})
}

function create_popup(text, t_before_decay,
					t_after_hover, hex_color, hover_hex_color)
{
	const popup_main = document.createElement('div');

	popup_main.className = "popup-main-div";
	popup_main.style.backgroundColor = hex_color;

	popup_main.onanimationend = remove_popup;
	popup_main.onmouseenter = popup_mouse_enter;
	popup_main.onmouseleave = popup_mouse_leave;

	popup_id = popup_list.length;
	popup_list.push({
		popup : popup_main,
		is_hover : false,
		have_been_hover : false,
		base_color : hex_color,
		hover_color : hover_hex_color
	});
	popup_handler(popup_list[popup_id], t_before_decay, t_after_hover);
	document.body.appendChild(popup_main);
	update_all_popups_pos();
}

function popup_mouse_enter()
{
	let popup_elem = popup_list.find(p => p.popup === this)
	popup_elem.is_hover = true;
	popup_elem.have_been_hover = true;
	popup_elem.popup.style.backgroundColor = popup_elem.hover_color;
}

function popup_mouse_leave()
{
	let popup_elem = popup_list.find(p => p.popup === this)
	popup_elem.is_hover = false;
	popup_elem.popup.style.backgroundColor = popup_elem.base_color;
}

function remove_popup()
{
	this.remove();
	popup_list.splice(popup_list.findIndex(pop => pop.popup === this), 1);
}

async function popup_handler(popup, t_before_decay, t_after_hover)
{
	await delay(t_before_decay);
	let should_redo = true;
	while (should_redo)
	{
		should_redo = false;
		if (popup.is_hover || popup.have_been_hover)
		{
			await delay(t_after_hover);
			should_redo = true;
		}
		popup.have_been_hover = false;
	}
	popup.popup.style.animationPlayState = "running";
}
