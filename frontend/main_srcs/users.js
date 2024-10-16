const defaultUserImage = 'img/compte-utilisateur-1.png';

let global_user_infos = undefined; 
// {
// 	profile_picture: defaultUserImage,
// 	username: "coucou"
// };
// TODO change user to undefined

async function get_profil_picture()
{
	const url = "https://localhost:8443/api/users/update/picture/";
	try
	{
		let fetched_data = await fetch_with_token(url, {
			method: 'GET',
			headers: {}
		});
		let data = await fetched_data.json();
		if (!fetched_data.ok)
			throw new Error("Error retrieving profil picture.");
		data = data.data;
		return data;
	}
	catch (error)
	{
		create_popup("Error retrieving profil picture.", 4000, 4000, HEX_RED, HEX_RED_HOVER);
		return ""; // TODO: default pp
	}
}

async function create_user_infos(username)
{
	if (username === undefined)
		return ;

	let picture = await get_profil_picture();
	global_user_infos = 
	{
		username : username,
		profile_picture: picture
	}
	updateUI();
}

function update_user_infos(username)
{
	global_user_infos.username = username;
}

function update_profile_picture_front(picture)
{
	global_user_infos.profile_picture = picture;
	update_pp();
}
