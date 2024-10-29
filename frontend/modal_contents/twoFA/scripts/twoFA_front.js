const nb_digit_inputs = 6;
let digit_inputs_setup = [];
let digit_inputs_valid = [];
const regex_digit = /^[0-9]/;

function clear_code_inputs_setup()
{
	for (input of digit_inputs_setup)
	{
		input.value = '';
		input.disabled = false;
	}
}

function clear_code_inputs_valid()
{
	for (input of digit_inputs_valid)
	{
		input.value = '';
		input.disabled = false;
	}
}

function get_inputs(id)
{
	switch (id) {
		case "tfas-key-enter-div":
			return digit_inputs_setup;
		case "tfav-key-enter-div":
			return digit_inputs_valid;
		default:
			return undefined;
	}
}

function animate_on_error(digit_inputs)
{
	const input_div = digit_inputs[0].parentNode.parentNode;
	input_div.style.animationPlayState = "running";
	for (input of digit_inputs)
	{
		input.style.border = "2px solid red";
		input.style.color = "var(--rose-error)";
	}
}

function on_animation_input_error_end()
{
	let digit_inputs = get_inputs(this.id);
	this.style.animationPlayState = "paused";
	
	for (input of digit_inputs)
	{
		input.style.border = "";
		input.style.color = "";
		input.value = '';
		input.disabled = false;
	}
	on_click_div_event(this);
}

function on_input_digit_event()
{
	let digit_inputs = get_inputs(this.parentNode.parentNode.id);
	const is_setup = digit_inputs == digit_inputs_setup ? true : false;
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
		if (cur_input_id == nb_digit_inputs - 1)
		{
			for (input of digit_inputs)
				input.disabled = true;
			send_code_to_validation(digit_inputs, is_setup);
			return ;
		}
		focus_on_digit_inputs(digit_inputs, cur_input_id + 1);
	}
}

function on_click_div_event(elem_clicked = undefined)
{
	let digit_inputs = get_inputs(elem_clicked.nodeType ? elem_clicked.id : this.id);
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

function focus_on_digit_inputs(digit_inputs, input_id)
{
	if (input_id < 0 || input_id > nb_digit_inputs - 1)
		return ;
	digit_inputs[input_id].focus();
}

function on_key_down_digit_event(event)
{
	let digit_inputs = get_inputs(this.parentNode.parentNode.id);
	let cur_input_id = 0;
	if (!regex_digit.test(event.key) && event.key != "Backspace")
		event.preventDefault();
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
		focus_on_digit_inputs(digit_inputs, cur_input_id - 1);
		return ;
	}
}

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

document.addEventListener("onModalsLoaded", function()
{
	const input_div = document.getElementById("tfas-key-enter-div");
	for (let i = 0; i < nb_digit_inputs; i++)
	{
		digit_inputs_setup.push(input_div.children[i].children[0]);
		digit_inputs_setup[i].oninput = on_input_digit_event;
		digit_inputs_setup[i].onkeydown = on_key_down_digit_event;
	}
	input_div.onclick = on_click_div_event;
	input_div.onanimationiteration = on_animation_input_error_end;
});
