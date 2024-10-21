let popup_list = [];
const space_between_popups = 3; // in px
const margin_top = 3; // in px

async function delay(ms, print)
{
	return new Promise(res => setTimeout(res, ms));
}

function update_all_popups_pos()
{
	popup_list.forEach((pop, index) =>
	{
		if (!pop.is_hover)
		{
			let pos = ((popup_list.length - 1) - index)
				* (pop.popup.getBoundingClientRect().height + space_between_popups)
				+ margin_top;
			pop.popup.style.top = pos.toString() + "px";
		}
	})
}

function on_click_popup_close()
{
	remove_popup(this.parentNode);
	update_all_popups_pos();
}

function add_popup_to_document_modal(popup_main)
{
	// modal_on_screen is not defined because i'm waiting for another branch to merge

	// let modal_on_screen = document.getElementById("modal-profile"); // test

	if (!modal_on_screen)
		document.body.appendChild(popup_main);
	else
		modal_on_screen.appendChild(popup_main);
}

/**
 * Create a popup on the top left corner of the viewport.
 * All times are in ms.
 * @param
 * text
 * Text to write in the popup. It will resize until it reaches a limit. It will never line break nor overflow.
 * @param
 * t_before_decay
 * Initial time before the popup begins to fade.
 * @param
 * t_after_hover
 * Time before the popup begins to fade after having being hovered.
 * @param
 * hex_color
 * Initial color of the popup.
 * @param
 * hover_hex_color
 * Color of the popup while being hovered.
 */
function create_popup(text, t_before_decay=2000,
					t_after_hover=4000, hex_color="HEX_GREEN", hover_hex_color="HEX_GREEN_HOVER")
{
	const popup_main = document.createElement('div');
	popup_main.className = "popup-main-div";
	popup_main.style.backgroundColor = hex_color;

	const popup_text = document.createElement('p');
	popup_text.className = "popup-text";
	popup_text.textContent = text;
	popup_main.appendChild(popup_text);

	const popup_close = document.createElement('img');
	popup_close.className = "popup-close";
	popup_close.src = "../../../img/remove_friend.png";
	popup_close.onclick = on_click_popup_close;
	popup_main.appendChild(popup_close);

	popup_main.onanimationend = remove_popup_auto;
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
	add_popup_to_document_modal(popup_main);
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

function remove_popup(popup)
{
	popup.remove();
	popup_list.splice(popup_list.findIndex(pop => pop.popup === popup), 1);
}

function remove_popup_auto()
{
	remove_popup(this);
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
			popup.have_been_hover = false;
			await delay(t_after_hover);
			should_redo = true;
		}
	}
	popup.popup.style.animationPlayState = "running";
}
