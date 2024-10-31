const HEX_RED = "#FF000080";
const HEX_RED_HOVER = "#FF0000C0";
const HEX_GREEN = "#00FF0080";
const HEX_GREEN_HOVER = "#00FF00C0";

async function refresh_token()
{
	const url = "/api/users/token/refresh/";
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
		if (is_connected())
		{
			logout_user_no_back();
			create_popup("Session expired.", 10000, 4000, HEX_RED, HEX_RED_HOVER);
		}
		throw new Error("Session expired.");
	}
	let data = await fetched_data.json();
	data = data.data;
	sessionStorage.setItem("access_token", data.access);
}

async function fetch_with_token(url, request_infos)
{
	if (sessionStorage.getItem("access_token") == null || sessionStorage.getItem("refresh_token") == null)
		return {ok: false};
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

let stop_click_on_all_page = true;

document.addEventListener("click", event =>
{
	if (stop_click_on_all_page)
	{
		event.stopPropagation();
		event.preventDefault();
	}
}, true);
