const correct_formats = ["image/png", "image/jpg", "image/jpeg"];

function prompt_picture_file()
{
	input_file_button.click();
}

function is_valid_file()
{
	if (input_file_button.files.length == 0) // cancel
		return false;
	if (input_file_button.files.length != 1)
	{
		create_popup("Error: You must provide only one file.",
			4000, 4000,
			hex_color="#FF000080", t_hover_color="#FF0000C0");
		return false;
	}
	console.log(input_file_button.files[0])
	if (!correct_formats.includes(input_file_button.files[0].type))
		return false;

}

function process_submitted_file()
{
	if (!is_valid_file())
		return ;
	// send to back and wait for validation
}

const form_pic = document.getElementById("picture-div");
form_pic.children[0].onclick = prompt_picture_file;
form_pic.children[1].onclick = prompt_picture_file;

const input_file_button = document.getElementById("picture-file-input");
input_file_button.onchange = process_submitted_file;

// jpg, jpeg, png