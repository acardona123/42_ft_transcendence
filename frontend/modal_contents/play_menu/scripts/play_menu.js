function play_menu_setup_display_on_game()
{
	const header = document.getElementById('modal-play-menu-header-text');
	const button_ia = document.getElementById('button-play-ia');

	if (global_game_modal === "FLAPPYBIRD")
	{
		header.textContent = "PLAY FLAPPYBIRD";
		button_ia.setAttribute('style', 'display:none !important;')
	}
	else
	{
		header.textContent = "PLAY PONG";
		button_ia.setAttribute('style', 'display:inline-block !important;')
	}
}

function init_play_menu_pong()
{
	set_global_game_pong()
	play_menu_setup_display_on_game();
	disable_buttons_play();
}

function init_play_menu_flappy_bird()
{
	set_global_game_flappy_bird()
	play_menu_setup_display_on_game();
	disable_buttons_play();
}

function open_game_menu_pong()
{
	if (is_connected() === true)
	{
		init_play_menu_pong();
		open_modal('modal-play', undefined, undefined, true);
	}
	else
	{
		open_modal('modal-login', clear_login_inputs, focus_modal_login, true);
	}
}

function open_game_menu_flappy_bird()
{
	if (is_connected() === true)
	{
		init_play_menu_flappy_bird();
		open_modal('modal-play', undefined, undefined, true);
	}
	else
	{
		open_modal('modal-login', clear_login_inputs, focus_modal_login, true);
	}
}

function return_to_modal_play(from_modal)
{
	close_modal(from_modal, undefined, false);
	open_modal("modal-play", undefined, undefined, true);
}
