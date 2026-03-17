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
	return createElement('div', {
		attributes: { role: 'group', class: `transaction-posting transaction-posting-${2 + DOM.transactionPostings.children.length}` },
		children: [
			createElement('input', {
				type: 'text',
				class: 'transaction-posting-account',
				placeholder: 'Account',
				attributes: { 'aria-label': 'Account', list: 'account-datalist' },
				required: true,
			}),
			createElement('input', {
				type: 'text',
				class: 'transaction-posting-amount',
				placeholder: 'Amount',
				attributes: { 'aria-label': 'Amount' },
				required: true,
			}),
			createElement('button', { textContent: 'X', class: 'transaction-delete-posting-btn' }),
		],
	});
}
