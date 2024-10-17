function clear_login_inputs()
{
	const list_inputs = document.getElementsByClassName("inputs-login");
	for (input of list_inputs)
	{
		input.value = '';
		on_input_write_when_filled(true, input);
	}
	document.getElementById("login-on-error-input-div").style.display = "none";
}

function clear_register_inputs()
{
	const list_inputs = document.getElementsByClassName("inputs-register");
	for (input of list_inputs)
	{
		input.value = '';
		on_input_write_when_filled(true, input);
	}
}

function set_input_position(elem)
{
	elem.oninput = on_input_write_when_filled;
	elem.parentNode.children[0].style.transform =
	"scale(0.8) translate(0px, -5px)";
	elem.style.paddingTop = "10px";
}

function reset_input_position(elem)
{
	elem.parentNode.children[0].style.transform = "none";
	elem.style.paddingTop = "0px";
	elem.oninput = on_input_write_when_empty;
}

function on_input_write_when_empty(is_not_event, elem)
{
	if (is_not_event === true)
		set_input_position(elem);
	else
		set_input_position(this);
}

function on_input_write_when_filled(is_not_event, elem)
{
	if (is_not_event === true)
		reset_input_position(elem);
	else if (this.value.length == 0)
		reset_input_position(this);
}

document.addEventListener("onModalsLoaded", function()
{
	const list_inputs = document.getElementsByClassName("inputs-login");
	
	for (const input of list_inputs)
	{
		input.oninput = on_input_write_when_empty;
	}
});
