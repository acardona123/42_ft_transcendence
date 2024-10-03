


document.addEventListener("onModalsLoaded", function()
{
	const input_div = document.getElementById("tfal-digit-real-input");

	input_div.addEventListener('select', function(event) {
		event.preventDefault();
	});

	openModalTwoFALogin();

});
