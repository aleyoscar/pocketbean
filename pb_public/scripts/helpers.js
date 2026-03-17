const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

function selectOption(select, value) {
	select.querySelectorAll('option').forEach((o) => {
		o.value === value ? o.selected = true : o.selected = false;
	});
}

function dec(num, decimals=2) {
    const factor = Math.pow(10, decimals);
	 return Math.round((parseFloat(num) + Number.EPSILON) * factor) / factor;
}

function cur(num, decimals=2) {
	return dec(num).toFixed(decimals);
}

function day(dateString) {
	const date = new Date(dateString);
	return date.toISOString().split('T')[0];
}

function utcToLocal(dateString) {
	if (!dateString) return;
	const date = new Date(dateString);
	const year  = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day   = String(date.getUTCDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function localToUtc(dateString) {
	if (!dateString) return;
	const date = new Date(dateString);
	return date.toISOString();
}
