const defaultUserImage = 'img/compte-utilisateur-1.png';

let global_user_infos = undefined;

function is_connected()
{
	return global_user_infos !== undefined;
}

async function get_profil_picture()
{
	const url = "/api/users/update/picture/";
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'GET',
			headers: {}
		});
		let data = await fetched_data.json();
		if (!fetched_data.ok)
			throw new Error("Error retrieving profile picture.");
		data = data.data;
		return data;
	}
	catch (error)
	{
		create_popup("Error retrieving profile picture.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
		return DEFAULT_PP_PATH;
	}
}

async function create_user_infos()
{
	const url = "/api/users/info/";
	try
	{
		let fetched_data = await fetch_with_token(url, 
		{
			method: 'GET',
			headers: {}
		});
		if (!fetched_data.ok)
			throw new Error("Error logging in.");
		let data = await fetched_data.json();
		data = data.data;
		global_user_infos =
		{
			username : data.username,
			profile_picture : data.profile_picture,
			pin : data.pin,
			is_oauth : data.is_oauth
		};
	}
	catch (error)
	{
		create_popup("Error logging in.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
		logout_user_no_back();
	}
}

function update_user_infos(username)
{
	global_user_infos.username = username;
}

function update_profile_picture_front(picture)
{
	global_user_infos.profile_picture = picture;
	edp_update_profile_picture();
	update_pp();
}
