function history_back_on_open(modal_id, funcs)
{
	if (modal_on_screen){
		stop_current_game();
		close_modal(modal_on_screen, undefined, false);
	}
	open_modal(modal_id, window[funcs.bf], window[funcs.af], false);
}

function history_back_on_close()
{
	if (modal_on_screen){
		stop_current_game();
		close_modal(modal_on_screen, undefined, false);
	}
}

function on_popstate_event(event)
{
	if (!event.state)
	{
		if (modal_on_screen)
			close_modal(modal_on_screen, undefined, false);
		return ;
	}
	if (event.state.open)
		history_back_on_open(event.state.modal_id, event.state.funcs);
	else
		history_back_on_close();
}

window.addEventListener("popstate", on_popstate_event);
