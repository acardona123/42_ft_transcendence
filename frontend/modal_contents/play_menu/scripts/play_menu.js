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
		button_ia.setAttribute('style', 'display:flex !important;')
	}
}

function init_play_menu()
{
	play_menu_setup_display_on_game();
	disable_buttons_play();
}
