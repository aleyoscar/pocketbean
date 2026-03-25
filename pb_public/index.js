
// ===================== HELPERS =====================

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

// ===================== DOM =====================

const DOM = {
	asideBtns: document.querySelectorAll('.aside-btn'),
	account: document.getElementById('account'),

	accountList: document.getElementById('account-list'),
	currencyList: document.getElementById('currency-list'),
	transactionList: document.getElementById('transaction-list'),

	accountDatalist: document.getElementById('account-datalist'),
	payeeDatalist: document.getElementById('payee-datalist'),
	linksDatalist: document.getElementById('links-datalist'),

	accounts: document.getElementById('accounts'),
	currencies: document.getElementById('currencies'),
	transactions: document.getElementById('transactions'),

	accountAddBtn: document.getElementById('account-add-btn'),
	currencyAddBtn: document.getElementById('currency-add-btn'),
	transactionAddBtn: document.getElementById('transaction-add-btn'),

	accountModal: document.getElementById('account-modal'),
	currencyModal: document.getElementById('currency-modal'),
	transactionModal: document.getElementById('transaction-modal'),

	accountForm: document.getElementById('account-form'),
	currencyForm: document.getElementById('currency-form'),
	transactionForm: document.getElementById('transaction-form'),

	accountTitle: document.getElementById('account-title'),
	accountError: document.getElementById('account-error'),
	accountId: document.getElementById('account-id'),
	accountDelete: document.getElementById('account-delete'),
	accountName: document.getElementById('account-name'),
	accountCurrency: document.getElementById('account-currency'),
	accountOpenDeleteBtn: document.getElementById('account-open-delete-btn'),
	accountDeleteBtn: document.getElementById('account-delete-btn'),
	accountSubmitBtn: document.getElementById('account-submit-btn'),

	currencyTitle: document.getElementById('currency-title'),
	currencyError: document.getElementById('currency-error'),
	currencyId: document.getElementById('currency-id'),
	currencyDelete: document.getElementById('currency-delete'),
	currencyName: document.getElementById('currency-name'),
	currencyDefault: document.getElementById('currency-default'),
	currencyOpenDeleteBtn: document.getElementById('currency-open-delete-btn'),
	currencyDeleteBtn: document.getElementById('currency-delete-btn'),
	currencySubmitBtn: document.getElementById('currency-submit-btn'),

	transactionTitle: document.getElementById('transaction-title'),
	transactionError: document.getElementById('transaction-error'),
	transactionId: document.getElementById('transaction-id'),
	transactionDelete: document.getElementById('transaction-delete'),
	transactionDate: document.getElementById('transaction-date'),
	transactionFlag: document.getElementById('transaction-flag'),
	transactionPayee: document.getElementById('transaction-payee'),
	transactionNotes: document.getElementById('transaction-notes'),
	transactionAddPostingBtn: document.getElementById('transaction-add-posting-btn'),
	transactionPostings: document.getElementById('transaction-postings'),
	transactionOpenDeleteBtn: document.getElementById('transaction-open-delete-btn'),
	transactionDeleteBtn: document.getElementById('transaction-delete-btn'),
	transactionSubmitBtn: document.getElementById('transaction-submit-btn'),

	loginForm: document.getElementById('login-form'),
	loginError: document.getElementById('login-error'),
	loginUsername: document.getElementById('login-username'),
	loginPassword: document.getElementById('login-password'),
	loginSubmit: document.getElementById('login-submit'),
	logout: document.getElementById('logout'),

	sections: document.querySelectorAll('main section'),
	toggleModals: document.querySelectorAll('.toggle-modal'),
	wrapper: document.getElementById('wrapper'),
}

// ===================== CONSTANTS =====================

const pb = new PocketBase("/");

// ===================== MODAL =====================

/*
 * Modal
 *
 * Pico.css - https://picocss.com
 * Copyright 2019-2024 - Licensed under MIT
 */

// Config
const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const scrollbarWidthCssVar = "--pico-scrollbar-width";
const animationDuration = 400; // ms
let visibleModal = null;

// Toggle modal
const toggleModal = (event) => {
	event.preventDefault();
	const modal = document.getElementById(event.currentTarget.dataset.target);
	if (!modal) return;
	modal && (modal.open ? closeModal(modal) : openModal(modal));
};

// Open modal
const openModal = (modal) => {
	const { documentElement: html } = document;
	const scrollbarWidth = getScrollbarWidth();
	if (scrollbarWidth) {
		html.style.setProperty(scrollbarWidthCssVar, `${scrollbarWidth}px`);
	}
	html.classList.add(isOpenClass, openingClass);
	setTimeout(() => {
		visibleModal = modal;
		html.classList.remove(openingClass);
	}, animationDuration);
	modal.showModal();
};

// Close modal
const closeModal = (modal) => {
	visibleModal = null;
	const { documentElement: html } = document;
	html.classList.add(closingClass);
	setTimeout(() => {
		html.classList.remove(closingClass, isOpenClass);
		html.style.removeProperty(scrollbarWidthCssVar);
		modal.close();
	}, animationDuration);
};

// Close with a click outside
document.addEventListener("click", (event) => {
	if (visibleModal === null) return;
	const modalContent = visibleModal.querySelector("article");
	const isClickInside = modalContent.contains(event.target);
	!isClickInside && closeModal(visibleModal);
});

// Close with Esc key
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && visibleModal) {
		closeModal(visibleModal);
	}
});

// Get scrollbar width
const getScrollbarWidth = () => {
	const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
	return scrollbarWidth;
};

// Is scrollbar visible
const isScrollbarVisible = () => {
	return document.body.scrollHeight > screen.height;
};

// ===================== COMPONENTS =====================

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

// ===================== RENDER =====================

function togglePostings(target) {
	DOM.transactionList.querySelectorAll('.transaction-posting-row').forEach(row => {
		if (row.dataset.transaction === target.dataset.id) row.classList.toggle('hide');
	});
}

function toggleAuth() {
	const isLoggedIn = !!pb.authStore.record;
	DOM.wrapper.classList.toggle('hide', !isLoggedIn);
	DOM.loginForm.classList.toggle('hide', isLoggedIn);
	DOM.account.textContent = isLoggedIn ? pb.authStore.record.username : '';
	return isLoggedIn;
}

function openSection(e) {
	e.preventDefault();
	DOM.sections.forEach((s) =>
		s.classList.toggle('hide', !s.id.includes(e.currentTarget.dataset.section)));
	DOM.asideBtns.forEach((b) =>
		b.classList.toggle('secondary', b.dataset.section != e.currentTarget.dataset.section));
}

function openAccountForm(e) {
	openTargetAccountForm(e.currentTarget);
}

function openCurrencyForm(e) {
	openTargetCurrencyForm(e.currentTarget);
}

function openTransactionForm(e) {
	openTargetTransactionForm(e.currentTarget);
}

function openTargetAccountForm(target) {
	DOM.accountTitle.textContent = 'Add Account';
	setError(DOM.accountError);
	DOM.accountId.value = '';
	DOM.accountDelete.value = '';
	DOM.accountForm.reset();
	DOM.accountOpenDeleteBtn.classList.add('hide');
	DOM.accountOpenDeleteBtn.textContent = 'Delete';
	DOM.accountDeleteBtn.classList.add('hide');
	DOM.accountName.value = '';
	setTimeout(() => DOM.accountName.focus(), 100);
	// selectOption(DOM.accountCurrency);
	if (target.dataset.id) {
		DOM.accountId.value = target.dataset.id;
		editAccount(target.dataset.id);
	}
	if (!visibleModal) openModal(DOM.accountModal);
}

function openTargetCurrencyForm(target) {
	DOM.currencyForm.reset();
	DOM.currencyTitle.textContent = 'Add Currency';
	setError(DOM.currencyError);
	DOM.currencyId.value = '';
	DOM.currencyDelete.value = '';
	DOM.currencyOpenDeleteBtn.classList.add('hide');
	DOM.currencyOpenDeleteBtn.textContent = 'Delete';
	DOM.currencyDeleteBtn.classList.add('hide');
	DOM.currencyName.value = '';
	setTimeout(() => DOM.currencyName.focus(), 100);
	DOM.currencyDefault.checked = false;
	if (target.dataset.id) {
		DOM.currencyId.value = target.dataset.id;
		editCurrency(target.dataset.id);
	}
	if (!visibleModal) openModal(DOM.currencyModal);
}

function openTargetTransactionForm(target) {
	DOM.transactionForm.reset();
	DOM.transactionTitle.textContent = 'Add Transaction';
	setError(DOM.transactionError);
	DOM.transactionId.value = '';
	DOM.transactionDelete.value = '';
	DOM.transactionOpenDeleteBtn.classList.add('hide');
	DOM.transactionOpenDeleteBtn.textContent = 'Delete';
	DOM.transactionDeleteBtn.classList.add('hide');
	DOM.transactionDate.valueAsDate = new Date();
	setTimeout(() => DOM.transactionDate.focus(), 100);
	DOM.transactionFlag.checked = false;
	DOM.transactionPayee.value = '';
	DOM.transactionNotes.value = '';
	// DOM.transactionLinks.value = '';
	DOM.transactionPostings.innerHTML = '';
	if (target.dataset.id) {
		DOM.transactionId.value = target.dataset.id;
		editTransaction(target.dataset.id);
	}
	if (!visibleModal) openModal(DOM.transactionModal);
}

function toggleAccountDelete(e) {
	DOM.accountDeleteBtn.classList.toggle('hide');
	DOM.accountDeleteBtn.classList.contains('hide') ?
		DOM.accountOpenDeleteBtn.textContent = 'Delete' : DOM.accountOpenDeleteBtn.textContent = 'Cancel';
}

function toggleCurrencyDelete(e) {
	DOM.currencyDeleteBtn.classList.toggle('hide');
	DOM.currencyDeleteBtn.classList.contains('hide') ?
		DOM.currencyOpenDeleteBtn.textContent = 'Delete' : DOM.currencyOpenDeleteBtn.textContent = 'Cancel';
}

function toggleTransactionDelete(e) {
	DOM.transactionDeleteBtn.classList.toggle('hide');
	DOM.transactionDeleteBtn.classList.contains('hide') ?
		DOM.transactionOpenDeleteBtn.textContent = 'Delete' : DOM.transactionOpenDeleteBtn.textContent = 'Cancel';
}

async function renderAccounts() {
	const records = await pb.collection('accounts').getFullList({
		sort: 'name',
		expand: 'currency',
	});
	DOM.accountList.innerHTML = '';
	DOM.accountDatalist.innerHTML = '';
	records.forEach((acct) => {
		DOM.accountList.append(createElement('tr', {
			class: 'account-row pointer row-hover',
			dataset: { id: acct.id, name: acct.name },
			children: [
				createElement('th', { attributes: { scope: 'row' }, textContent: acct.name }),
				createElement('td', { textContent: acct.expand.currency.name }),
			],
		}));
		DOM.accountDatalist.append(createElement('option', {
			value: acct.name,
			dataset: { id: acct.id }
		}));
	});
}

async function renderCurrencies() {
	const records = await pb.collection('currencies').getFullList({
		sort: 'name',
	});
	DOM.currencyList.innerHTML = '';
	records.forEach((curr) => {
		DOM.currencyList.append(createElement('tr', {
			class: 'currency-row pointer row-hover',
			dataset: { id: curr.id },
			children: [
				createElement('th', { attributes: { scope: 'row' }, textContent: curr.name }),
				createElement('td', { textContent: curr.default ? 'Default' : '' }),
			],
		}));
	});
}

async function renderPostings() {

}

async function renderTransactions() {
	const records = await pb.collection('transactions').getFullList({
		sort: '-date,created',
		expand: 'postings_via_transaction,postings_via_transaction.account,postings_via_transaction.currency',
	});

	DOM.transactionList.innerHTML = '';
	const payees = new Set();

	for (const txn of records) {
		let txnAmount = 0;
		const postings = txn.expand.postings_via_transaction;
		const postingRows = [];
		postings.sort((a, b) => (a.order || 0) - (b.order || 0));
		for (const posting of postings) {
			txnAmount += posting.amount > 0 ? posting.amount : 0;
			postingRows.push(createElement('tr', {
				class: `transaction-posting-row pointer row-background hide`,
				dataset: { transaction: txn.id },
				children: [
					createElement('td'),
					createElement('td'),
					createElement('td'),
					createElement('td', { textContent: posting.expand.account.name }),
					createElement('td', { textContent: cur(posting.amount), class: 'text-right' }),
					createElement('td', { textContent: posting.expand.currency.name, class: 'text-right' }),
				]
			}));
		}
		DOM.transactionList.append(createElement('tr', {
			class: 'transaction-row pointer row-hover',
			dataset: { id: txn.id },
			children: [
				createElement('th', { attributes: { scope: 'row' }, textContent: utcToLocal(txn.date) }),
				createElement('td', { textContent: txn.flag ? '*' : '!' }),
				createElement('td', { textContent: txn.payee }),
				createElement('td', { textContent: txn.notes || '' }),
				createElement('td', { textContent: cur(txnAmount), class: 'text-right' }),
				createElement('td', {
					class: 'text-right',
					children: [
						createElement('button', {
							class: 'transaction-edit-btn',
							textContent: 'Edit',
							dataset: { id: txn.id },
						}),
					],
				}),
			]
		}));
		postingRows.forEach(row => DOM.transactionList.append(row));
		if (txn.payee) payees.add(txn.payee);
	}

	// Populate payee datalist
	DOM.payeeDatalist.innerHTML = '';
	[...payees].sort().forEach(payee => {
		DOM.payeeDatalist.append(createElement('option', { value: payee }));
	});
}

async function renderAll() {
	await renderCurrencies();
	await renderAccounts();
	await renderTransactions();
	await updateCurrencySelects();
}

async function addPosting(e) {
	e.preventDefault();
	DOM.transactionPostings.append(createPosting());
	await updateCurrencySelects();
}

function removePosting(target) {
	setTimeout(() => { target.parentNode.remove() }, 100);
}

async function updateCurrencySelects() {
	try {
		const records = await pb.collection('currencies').getFullList({
			sort: 'name',
		});

		// Safely get the default currency (no error if none exists)
		let defaultCurrency = null;
		try {
			defaultCurrency = await pb.collection('currencies').getFirstListItem('default=true');
		} catch (err) {
			if (err.status !== 404) throw err;   // re-throw real errors
			// else: no default exists → defaultCurrency remains null
		}

		const currencySelects = document.querySelectorAll('.currency-select');

		currencySelects.forEach((select) => {
			select.innerHTML = '';

			if (records.length === 0) {
				select.appendChild(createElement('option', {
					value: '',
					textContent: 'No currencies yet',
					attributes: { disabled: true }
				}));
				return;
			}

			records.forEach((curr) => {
				const isDefault = defaultCurrency && defaultCurrency.id === curr.id;

				select.appendChild(createElement('option', {
					value: curr.id,
					textContent: curr.name,
					attributes: isDefault ? { selected: 'selected' } : {}
				}));
			});
		});
	} catch (err) {
		console.error('Failed to update currency selects:', err);
	}
}

// ===================== AUTH =====================

async function login(e) {
	e.preventDefault();
	setError(DOM.loginError);
	DOM.loginSubmit.disabled = true;
	try {
		const formData = new FormData(DOM.login);
		const username = DOM.loginUsername.value.trim();
		const password = DOM.loginPassword.value.trim();
		if (!username || !password) throw new Error("Please enter both username and password");
		const authData = await pb.collection("users").authWithPassword(username, password);
		DOM.loginForm.reset();
		await renderAll();
	} catch (err) {
		setError(DOM.loginError, err);
	} finally {
		toggleAuth();
		DOM.loginSubmit.disabled = false;
	}
}

function logout() {
	pb.authStore.clear();
	toggleAuth();
}

// ===================== MANAGE =====================

function syncAccountId(e) {
	const input = e.target;
	const row = input.closest('.transaction-posting');
	const account = row.querySelector('.transaction-posting-account');
	const accountId = row.querySelector('.transaction-posting-account-id');
	const option = Array.from(DOM.accountDatalist.options).find(opt => opt.value === account.value.trim());

	accountId.value = (option && option.dataset.id) ? option.dataset.id : '';
}

async function createPostings(transactionId) {
	const newPostings = [];
	DOM.transactionForm.querySelectorAll('.transaction-posting').forEach((row, index) => {
		const accountId = row.querySelector('.transaction-posting-account-id').value.trim();
		const amountStr = row.querySelector('.transaction-posting-amount').value.trim();
		const currencyId = row.querySelector('.transaction-posting-currency').value;

		if (accountId && amountStr && currencyId) newPostings.push({
			transaction: transactionId,
			user: pb.authStore.record.id,
			account: accountId,
			amount: dec(amountStr),
			currency: currencyId,
			order: index
		});
	});
	for (const posting of newPostings) {
		await pb.collection('postings').create(posting);
	}
}

async function submitAccount(e) {
	e.preventDefault();
	setError(DOM.accountError);
	try {
		const id = DOM.accountId.value;
		const del = DOM.accountDelete.value;
		let record;
		if (del && id) {
			await pb.collection('accounts').delete(id);
		} else {
			const data = {
				"user": pb.authStore.record.id,
				"name": DOM.accountName.value.trim(),
				"currency": DOM.accountCurrency.value,
			};
			if (id) record = await pb.collection('accounts').update(id, data);
			else record = await pb.collection('accounts').create(data);
		}
		await renderAccounts();
		await updateCurrencySelects();
		closeModal(DOM.accountModal);
	} catch (err) {
		setError(DOM.accountError, err);
	}
}

async function submitCurrency(e) {
	e.preventDefault();
	setError(DOM.currencyError);
	try {
		const id = DOM.currencyId.value;
		const del = DOM.currencyDelete.value;
		let record;
		if (del && id) {
			await pb.collection('currencies').delete(id);
		} else {
			const data = {
				"user": pb.authStore.record.id,
				"name": DOM.currencyName.value.trim(),
				"currency": DOM.currencyDefault.checked,
			};
			if (id) record = await pb.collection('currencies').update(id, data);
			else record = await pb.collection('currencies').create(data);
		}
		await renderAll();
		closeModal(DOM.currencyModal);
	} catch (err) {
		setError(DOM.currencyError, err);
	}
}

async function deleteAllPostings(transactionId) {
	const oldPostings = await pb.collection('postings').getFullList({
		filter: `transaction="${transactionId}"`,
	});

	for (const posting of oldPostings) {
		await pb.collection('postings').delete(posting.id);
	}
}

async function submitTransaction(e) {
	e.preventDefault();
	setError(DOM.transactionError);

	try {
		const id = DOM.transactionId.value;
		const isDelete = DOM.transactionDelete.value === 'delete';

		if (isDelete && id) {
			await deleteAllPostings(id);
			await pb.collection('transactions').delete(id);
		} else {
			const txData = {
				user: pb.authStore.record.id,
				date: localToUtc(DOM.transactionDate.value),
				flag: DOM.transactionFlag.checked,
				payee: DOM.transactionPayee.value.trim(),
				notes: DOM.transactionNotes.value.trim(),
			};

			let transaction;
			if (id) {
				transaction = await pb.collection('transactions').update(id, txData);
			} else {
				transaction = await pb.collection('transactions').create(txData);
			}

			// === DELETE ALL + RECREATE ALL POSTINGS ===
			await deleteAllPostings(transaction.id);
			await createPostings(transaction.id);
		}

		await renderTransactions();
		closeModal(DOM.transactionModal);

	} catch (err) {
		setError(DOM.transactionError, err);
	}
}

async function deleteAccount(e) {
	DOM.accountDelete.value = 'delete';
	submitAccount(e);
}

async function deleteCurrency(e) {
	DOM.currencyDelete.value = 'delete';
	submitCurrency(e);
}

async function deleteTransaction(e) {
	DOM.transactionDelete.value = 'delete';
	submitTransaction(e);
}

async function editAccount(id) {
	setError(DOM.accountError);
	try {
		const record = await pb.collection('accounts').getOne(id, { expand: 'currency' });
		if (!record) throw new Error(`Unable to edit account with id ${id}`);
		DOM.accountTitle.textContent = 'Edit Account';
		DOM.accountId.value = record.id;
		DOM.accountName.value = record.name;
		selectOption(DOM.accountCurrency, record.expand.currency.id);
		DOM.accountOpenDeleteBtn.classList.remove('hide');
	} catch (err) {
		setError(DOM.accountError, err);
	}
}

async function editCurrency(id) {
	try {
		const record = await pb.collection('currencies').getOne(id);
		if (!record) throw new Error(`Unable to edit currency with id ${id}`);
		DOM.currencyTitle.textContent = 'Edit Currency';
		DOM.currencyId.value = record.id;
		DOM.currencyName.value = record.name;
		DOM.currencyDefault.checked = record.default;
		DOM.currencyOpenDeleteBtn.classList.remove('hide');
	} catch (err) {
		setError(DOM.currencyError, err);
	}
}

async function editTransaction(id) {
	try {
		const record = await pb.collection('transactions').getOne(id, {
			expand: 'postings_via_transaction, postings_via_transaction.account, postings_via_transaction.currency'
		});

		DOM.transactionTitle.textContent = 'Edit Transaction';
		DOM.transactionId.value = id;
		DOM.transactionOpenDeleteBtn.classList.remove('hide');

		DOM.transactionDate.value = utcToLocal(record.date);
		DOM.transactionFlag.checked = record.flag || false;
		DOM.transactionPayee.value = record.payee || '';
		DOM.transactionNotes.value = record.notes || '';

		// Clear previous postings
		DOM.transactionPostings.innerHTML = '';

		const postings = record.expand?.postings_via_transaction || [];
		postings.sort((a, b) => (a.order || 0) - (b.order || 0));
		let row;
		postings.forEach(posting => {
			if (posting.order > 1) row = createPosting();
			else row = DOM.transactionForm.querySelector(`.transaction-posting-${posting.order}`);
			row.querySelector('.transaction-posting-id').value = posting.id;
			row.querySelector('.transaction-posting-account-id').value = posting.expand.account.id;
			row.querySelector('.transaction-posting-account').value = posting.expand.account.name;
			row.querySelector('.transaction-posting-amount').value = cur(posting.amount);
			selectOption(row.querySelector('.transaction-posting-currency'), posting.expand.currency.id);
			if (posting.order > 1) DOM.transactionPostings.append(row);
		});

		await updateCurrencySelects();

	} catch (err) {
		setError(DOM.transactionError, err);
	}
}

// ===================== EVENTS =====================

function attachListeners() {
	DOM.asideBtns.forEach((b) => b.addEventListener('click', openSection));

	DOM.accountAddBtn.addEventListener('click', openAccountForm);
	DOM.currencyAddBtn.addEventListener('click', openCurrencyForm);
	DOM.transactionAddBtn.addEventListener('click', openTransactionForm);

	DOM.accountForm.addEventListener('submit', submitAccount);
	DOM.currencyForm.addEventListener('submit', submitCurrency);
	DOM.transactionForm.addEventListener('submit', submitTransaction);

	DOM.accountOpenDeleteBtn.addEventListener('click', toggleAccountDelete);
	DOM.currencyOpenDeleteBtn.addEventListener('click', toggleCurrencyDelete);
	DOM.transactionOpenDeleteBtn.addEventListener('click', toggleTransactionDelete);

	DOM.accountDeleteBtn.addEventListener('click', deleteAccount);
	DOM.currencyDeleteBtn.addEventListener('click', deleteCurrency);
	DOM.transactionDeleteBtn.addEventListener('click', deleteTransaction);

	DOM.loginForm.addEventListener('submit', login);
	DOM.logout.addEventListener('click', logout);
	DOM.toggleModals.forEach((m) => m.addEventListener('click', toggleModal));
	DOM.transactionAddPostingBtn.addEventListener('click', addPosting);

	DOM.transactionForm.querySelectorAll('.transaction-posting-account').forEach(input =>
		input.addEventListener('input', syncAccountId)
	);

	DOM.accountList.addEventListener('click', (e) => {
		e.preventDefault();
		const acct = e.target.closest('.account-row');
		if (acct) openTargetAccountForm(acct);
	});

	DOM.currencyList.addEventListener('click', (e) => {
		e.preventDefault();
		const curr = e.target.closest('.currency-row');
		if (curr) openTargetCurrencyForm(curr);
	});

	DOM.transactionList.addEventListener('click', (e) => {
		const editBtn = e.target.closest('.transaction-edit-btn');
		if (editBtn) {
			openTargetTransactionForm(editBtn);
			return;
		}

		const row = e.target.closest('.transaction-row');
		if (row) togglePostings(row);
	});

	DOM.transactionPostings.addEventListener('click', (e) => {
		e.preventDefault();
		const btn = e.target.closest('.transaction-delete-posting-btn');
		if (btn) removePosting(btn);
	});
}

// ===================== INDEX =====================

async function bootstrap() {
	attachListeners();
	if (toggleAuth()) await renderAll();
}

bootstrap();
