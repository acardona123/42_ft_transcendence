const HEX_RED = "#FF000080";
const HEX_RED_HOVER = "#FF0000C0";

async function refresh_token()
{
	const url = "https://localhost:8443/api/users/token/refresh/";
	const body = JSON.stringify({
		refresh : sessionStorage.getItem("refresh_token")
	});

	let fetched_data = await fetch(url, {
		method: 'POST',
		headers: new Headers({'content-type': 'application/json'}),
		body: body
	});
	if (!fetched_data.ok)
	{
		logout_user();
		throw new Error("You have been disconnected.");
	}
	let data = await fetched_data.json();
	data = data.data;
	sessionStorage.setItem("access_token", data.access);
}

async function fetch_with_token(url, request_infos)
{
	request_infos.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access_token");
	let fetched_data = await fetch(url, request_infos);
	if (fetched_data.status != 401)
	{
		return fetched_data;
	}
	await refresh_token();
	request_infos.headers["Authorization"] = "Bearer " + sessionStorage.getItem("access_token");
	fetched_data = await fetch(url, request_infos);
	return fetched_data;
}

let stop_click_on_all_page = false;

document.addEventListener("click", event =>
{
	if (stop_click_on_all_page)
	{
		event.stopPropagation();
		event.preventDefault();
	}
}, true);
