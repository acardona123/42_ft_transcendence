function history_back_on_open(modal_id, funcs)
{
	if (modal_on_screen)
		close_modal(modal_on_screen, undefined, false); // TODO: close game edge case
	open_modal(modal_id, window[funcs.bf], window[funcs.af], false);
}

function history_back_on_close(modal_id, funcs)
{
	if (modal_on_screen)
		close_modal(modal_on_screen, undefined, false);
	close_modal(modal_id, window[funcs?.bf], false);
}

function on_popstate_event(event)
{
	console.log(event.state);
	if (!event.state)
	{
		if (modal_on_screen)
			close_modal(modal_on_screen, undefined, false);
		return ;
	}
	if (event.state.open)
		history_back_on_open(event.state.modal_id, event.state.funcs);
	else
		history_back_on_close(event.state.modal_id, event.state.funcs);
}

document.addEventListener("keydown", (event) =>
{
	if (event.key == "a")
	{
		console.log("printing:");
		console.log(history.state);
	}
});

window.addEventListener("popstate", on_popstate_event);

window.addEventListener("beforeunload", function(e){

});
