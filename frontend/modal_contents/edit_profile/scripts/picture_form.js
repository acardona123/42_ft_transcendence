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
	return true;
}

async function send_picture_to_back(form_data)
{
	const url = "https://localhost:8443/api/users/update/picture/";
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'PUT',
			headers: {},
			body: form_data
		});
		if (!fetched_data.ok && fetched_data.status != 400)
			throw new Error(`${fetched_data.status}`);
		let data = await fetched_data.json();
		data = data.data;
		if (fetched_data.status == 400)
		{
			create_popup(data.profile_picture, 4000, 4000, HEX_RED, HEX_RED_HOVER);
			return ;
		}
		create_popup("Profile picture updated.", 4000, 4000, HEX_GREEN, HEX_GREEN_HOVER);
		// TODO: update pp
	}
	catch (error)
	{
		create_popup("Error while uploading image.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
		return ;
	}
}

function process_submitted_file()
{
	if (!is_valid_file())
		return ;

	let form_data = new FormData();
	form_data.append('profile_picture', input_file_button.files[0]);
	send_picture_to_back(form_data);
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
