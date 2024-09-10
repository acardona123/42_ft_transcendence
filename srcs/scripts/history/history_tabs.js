let clicked_element = undefined;

function set_border_hider(elem)
{
	const hider = document.createElement('div');
	const border_size = 5;

	hider.style.backgroundColor = '#755632';
	hider.style.position = 'absolute';
	hider.style.zIndex = "1";

	const bounds = elem.getBoundingClientRect();
	hider.style.height = '5px';
	hider.style.width = (bounds.width - border_size * 2).toString() + 'px';
	elem.appendChild(hider);
}

function unload_elements()
{
	const elem = document.getElementById("history_list");

	while (elem.childNodes.length > 0)
		elem.childNodes[0].remove();
}

function load_elements(elem)
{
	update_history_list({type : elem.textContent});
}

function on_click_tab_history(elem)
{
	if (clicked_element == elem)
		return;
	
	// unload all other tabs
	if (clicked_element)
	{
		clicked_element.style.backgroundColor = '#795833';
		clicked_element.childNodes[1]?.remove();
		unload_elements();
	}
	// load tab
	clicked_element = elem;
	load_elements(clicked_element);

	elem.style.backgroundColor = '#755632';

	// remove border bottom
	set_border_hider(elem);
}

// set click on first tab by default
on_click_tab_history(document.getElementsByClassName("tab-text")[0]);
