function on_input_write_when_empty()
{
	this.oninput = on_input_write_when_filled;
	this.parentNode.children[0].style.transform =
	"scale(0.8) translate(0px, -5px)";
	this.style.paddingTop = "10px";
}

function on_input_write_when_filled()
{
	if (this.value.length == 0)
	{
		this.parentNode.children[0].style.transform = "none";
		this.style.paddingTop = "0px";
		this.oninput = on_input_write_when_empty;
	}
}

document.addEventListener("onModalsLoaded", function()
{
	const list_inputs = document.getElementsByClassName("inputs-login");
	
	for (const input of list_inputs)
	{
		input.oninput = on_input_write_when_empty;
	}
});
