const correct_formats = ["image/png", "image/jpg", "image/jpeg"];

function prompt_picture_file()
{
	input_file_button.click();
}

function on_mouse_picture_enter()
{
	this.parentNode.children[0].style.filter = "brightness(70%)";
	this.parentNode.children[1].style.filter = "brightness(70%)";
}

function on_mouse_picture_leave()
{
	this.parentNode.children[0].style.filter = "brightness(100%)";
	this.parentNode.children[1].style.filter = "brightness(100%)";
}

function is_valid_file()
{
	if (input_file_button.files.length == 0) // cancel
		return false;
	if (input_file_button.files.length != 1)
	{
		create_popup("Error: You must provide only one file.",
			4000, 4000,
			hex_color=HEX_RED, t_hover_color=HEX_RED_HOVER);
		return false;
	}
	if (!correct_formats.includes(input_file_button.files[0].type))
	{
		create_popup("Error: Accepted formats are [png, jpg, jpeg].",
			4000, 4000,
			hex_color=HEX_RED, t_hover_color=HEX_RED_HOVER);
		return false;
	}

}

function process_submitted_file()
{
	if (!is_valid_file())
		return ;
	// send to back and wait for validation
}

let input_file_button;

document.addEventListener("onModalsLoaded", function()
{
	const form_pic = document.getElementById("edp-picture-div");
	form_pic.children[0].onclick = prompt_picture_file;
	form_pic.children[1].onclick = prompt_picture_file;
	form_pic.children[0].onmouseenter = on_mouse_picture_enter;
	form_pic.children[0].onmouseleave = on_mouse_picture_leave;
	form_pic.children[1].onmouseenter = on_mouse_picture_enter;
	form_pic.children[1].onmouseleave = on_mouse_picture_leave;
	
	input_file_button = document.getElementById("edp-picture-file-input");
	input_file_button.onchange = process_submitted_file;
});
