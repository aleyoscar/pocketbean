const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

function selectOption(select, value = '') {
	select.querySelectorAll('option').forEach(o => {
		o.selected = (o.value === value);
	});
}

function dec(num, decimals = 2) {
	const factor = Math.pow(10, decimals);
	return Math.round((parseFloat(num) + Number.EPSILON) * factor) / factor;
}

function cur(num, decimals = 2) {
	return num.toFixed(decimals);
}

function utcToLocal(dateString) {
	if (!dateString) return '';
	const date = new Date(dateString);
	const year = date.getUTCFullYear();
	const month = String(date.getUTCMonth() + 1).padStart(2, '0');
	const day = String(date.getUTCDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function localToUtc(dateString) {
	if (!dateString) return null;
	const date = new Date(dateString);
	return date.toISOString();
}

function setError(el, err = '') {
	if (!err) {
		el.classList.add('hide');
		el.textContent = '';
	} else {
		el.textContent = err.message || err;
		el.classList.remove('hide');
		console.error(err);
	}
}

function createElement(tag, options = {}) {
	const el = document.createElement(tag);

	if (options.id) el.id = options.id;
	if (options.class) el.className = options.class;
	if (options.textContent) el.textContent = options.textContent;
	if (options.type) el.type = options.type;
	if (options.checked) el.checked = options.checked;
	if (options.value) el.value = options.value;
	if (options.placeholder) el.placeholder = options.placeholder;
	if (options.required) el.required = true;

	if (options.dataset) {
		Object.entries(options.dataset).forEach(([key, value]) => {
			el.dataset[key] = value;
		});
	}

	if (options.attributes) {
		Object.entries(options.attributes).forEach(([key, value]) => {
			el.setAttribute(key, value);
		});
	}

	if (options.children) {
		options.children.forEach(child => {
			if (child instanceof Element) {
				el.appendChild(child);
			} else {
				el.appendChild(document.createTextNode(child));
			}
		});
	}

	if (options.innerHTML) el.innerHTML = options.innerHTML;
	return el;
}

function createPosting() {
	const count = DOM.transactionPostings.children.length + 2;
	const row = createElement('div', {
		class: `transaction-posting transaction-posting-${count}`,
		attributes: { role: 'group' },
		children: [
			createElement('button', {
				textContent: 'X',
				class: 'transaction-delete-posting-btn secondary'
			}),
			createElement('input', { type: 'hidden', class: 'transaction-posting-id' }),
			createElement('input', { type: 'hidden', class: 'transaction-posting-account-id' }),
			createElement('input', {
				type: 'text',
				class: 'transaction-posting-account',
				placeholder: 'Account',
				attributes: { list: 'account-datalist', 'aria-label': 'Account' },
				required: true
			}),
			createElement('input', {
				type: 'text',
				class: 'transaction-posting-amount',
				placeholder: 'Amount',
				attributes: { 'aria-label': 'Amount' },
				required: true
			}),
			createElement('select', {
				class: 'transaction-posting-currency currency-select',
				attributes: { 'aria-label': 'Currency' },
				required: true
			})
		]
	});

	const accountInput = row.querySelector('.transaction-posting-account');
	accountInput.addEventListener('input', syncAccountId);

	return row;
}
