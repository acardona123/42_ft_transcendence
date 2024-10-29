function set_border_hider(elem)
{
	const hider = document.createElement('div');
	const border_size = 5;

	hider.style.backgroundColor = 'var(--violet)';
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
	update_history_list(elem.textContent);
}

function on_click_tab_history(elem)
{
	// unload all other tabs
	const tabs_history = document.getElementById("prof-tabs-history");
	for (child of tabs_history.children)
	{
		child.style.backgroundColor = 'var(--violet)';
		child.childNodes[1]?.remove();
	}
	unload_elements();
	// load tab
	load_elements(elem);

	elem.style.backgroundColor = 'var(--violet)';

	// remove border bottom
	set_border_hider(elem);
}

// document.addEventListener("onModalsLoaded", function()
// {
// 	// set click on first tab by default
// 	on_click_tab_history(document.getElementsByClassName("prof-tab-text")[0]);
// });
