function calcValue(slider) {
	let valuePercentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
	slider.style.background = 'linear-gradient(to right, green ' + valuePercentage + '%, #ebe9e7 ' + valuePercentage + '%)';
}

function invalidForm(id)
{
	const form = document.getElementById(id);
	const formElements = form.querySelectorAll('input, select, textarea');
	const elements = Array.from(formElements);

	const countMaxValues = elements.filter((element) => element.value == element.max && element.type == "range").length;

	const btns = form.querySelectorAll("button[type='submit']");
	const values = form.querySelectorAll('.slider-value');

	if (countMaxValues > 1) {
		btns.forEach((btn) => {
		btn.disabled = true;
		});

		values.forEach((value) => {
			value.style.backgroundColor = "red";
		});
	}
	else {
		btns.forEach((btn) => {
		btn.disabled = false;
		});

		values.forEach((value) => {
			value.style.backgroundColor = "green";
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
	var errorFlieds = document.querySelectorAll('.error');

	errorFlieds.forEach(errorField => {
		errorField.textContent = '';
		errorField.style.display = 'none';
	});
}

function addFocusOutListener() {
	var inputs = document.querySelectorAll('.input-container input');

	inputs.forEach(function(input) {
			input.addEventListener('focusout', function() {
				if (input.value !== "") {
					input.classList.add('has-content');
				} else {
					input.classList.remove('has-content');
				}
			});
		});
}
