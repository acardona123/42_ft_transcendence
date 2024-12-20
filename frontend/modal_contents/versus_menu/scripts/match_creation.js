function calcValue(slider) {
	let valuePercentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
	slider.style.background = 'linear-gradient(to right, var(--violet) ' + valuePercentage + '%, var(--dark-violet) ' + valuePercentage + '%)';
}

function get_max_values_from_form(id)
{
	const form = document.getElementById(id);
	const formElements = form.querySelectorAll('input, select, textarea');
	const elements = Array.from(formElements);

	const count = elements.filter((element) => element.value == element.max && element.type == "range").length;

	return count;
}

function invalidForm(id)
{
	const form = document.getElementById(id);

	const max_values = get_max_values_from_form(id);

	const btns = form.querySelectorAll("button[type='submit']");
	const values = form.querySelectorAll('.slider-value');

	if (max_values > 1) {
		btns.forEach((btn) => {
		btn.disabled = true;
		});

		values.forEach((value) => {
			value.style.backgroundColor = "var(--rose-error)";
		});
	}
	else
	{
		if (id === "versus-match-form")
		{
			check_disable_button_versus_form();
		}
		else if (id === "tournament-form")
		{
			check_not_enough_player_tournament();
		}
		else
		{
			btns.forEach((btn) => {
				btn.disabled = false;
			});
		}

		values.forEach((value) => {
			value.style.backgroundColor = "var(--violet)";
		});
	}
}

function formatTime(value) {
	const minutes = Math.floor(value / 60);
	const seconds = value % 60;
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} min`;
}

function updateSlider(idform) {
	let allSliders = document.getElementById(idform).querySelectorAll('.slider');
	let allValues = document.getElementById(idform).querySelectorAll('.slider-value');

	allSliders.forEach((slider, index) => {
		let value = allValues[index];

		if (slider.value == slider.max)
			value.textContent = "∞";
		else
		{
			if (slider.classList.contains('time'))
				value.textContent = formatTime(slider.value);
			else
				value.textContent = slider.value;
		}

		calcValue(slider);
		invalidForm(idform);
		
		slider.addEventListener('input', function() {
			calcValue(slider);
			if (slider.value == slider.max)
				value.textContent = "∞";
			else
				{
					if (slider.classList.contains('time'))
						value.textContent = formatTime(slider.value);
					else
						value.textContent = slider.value;
				}
			invalidForm(idform);
		});
	});
}

// ======================================

function isdigit(str)
{
	return /^\d+$/.test(str);
}

function pincodeOnlyDigits(id) {
	const pincode = document.getElementById(id);

	pincode.oninput = function() {
		if (!isdigit(pincode.value)) {
			pincode.value = pincode.value.slice(0, -1);
		}
	}
}

function clearInputFields() {
	var inputs = document.querySelectorAll('.input-container input');
	inputs.forEach(function(input) {
		input.value = '';
		input.classList.remove('has-content');
	});
}

function clearErrorFields() {
	var error_divs = document.querySelectorAll('.error-div');

	error_divs.forEach(error_div => {
		error_div.style.display = 'none';
	});
}

function addFocusOutListener() {
	var inputs = document.querySelectorAll('.input-container input');

	inputs.forEach(function (input) {
		input.addEventListener('focusout', function () {
			if (input.value !== "") {
				input.classList.add('has-content');
			} else {
				input.classList.remove('has-content');
			}
		});
	});
}
