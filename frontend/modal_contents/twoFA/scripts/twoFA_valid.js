document.addEventListener("onModalsLoaded", function()
{
	const input_div = document.getElementById("tfav-key-enter-div");
	for (let i = 0; i < nb_digit_inputs; i++)
	{
		digit_inputs_valid.push(input_div.children[i].children[0]);
		digit_inputs_valid[i].oninput = on_input_digit_event;
		digit_inputs_valid[i].onkeydown = on_key_down_digit_event;
	}
	input_div.onclick = on_click_div_event;
	input_div.onanimationiteration = on_animation_input_error_end;
});
