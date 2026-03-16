const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

function selectOption(select, value) {
	select.querySelectorAll('option').forEach((o) => {
		o.value === value ? o.selected = true : o.selected = false;
	});
}
