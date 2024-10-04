const nb_digit_inputs = 6;
let digit_inputs = [];

function focus_on_digit_inputs(input_id)
{
	if (input_id < 0 || input_id > nb_digit_inputs - 1)
		return ;
	digit_inputs[input_id].focus();
}

function on_key_down_digit_event(event)
{
	let cur_input_id = 0;
	for (let i = 0; i < nb_digit_inputs; i++)
	{
		if (digit_inputs[i] === this)
		{
			cur_input_id = i;
			break;
		}
	}
	if (event.key == "Backspace")
	{
		if (this.value.length == 1 && cur_input_id == nb_digit_inputs - 1)
		{
			this.value = '';
			return ;
		}
		focus_on_digit_inputs(cur_input_id - 1);
		return ;
	}
}

function on_input_digit_event()
{
	let cur_input_id = 0;
	for (let i = 0; i < nb_digit_inputs; i++)
	{
		if (digit_inputs[i] === this)
		{
			cur_input_id = i;
			break;
		}
	}
	if (this.value.length == 1)
	{
		focus_on_digit_inputs(cur_input_id + 1);
	}
}

function on_click_div_event()
{
	for (input of digit_inputs)
	{
		if (input.value.length == 0)
		{
			input.focus();
			return ;
		}
	}
	digit_inputs[nb_digit_inputs - 1].focus();
}

document.addEventListener("onModalsLoaded", function()
{
	const input_div = document.getElementById("tfal-key-enter-div");
	for (let i = 0; i < nb_digit_inputs; i++)
	{
		digit_inputs.push(input_div.children[i].children[0]);
		digit_inputs[i].oninput = on_input_digit_event;
		digit_inputs[i].onkeydown = on_key_down_digit_event;
	}
	input_div.onclick = on_click_div_event;
	openModalTwoFALogin();
});
