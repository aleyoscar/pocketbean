function togglePostings(target) {
	DOM.transactionList.querySelectorAll('.transaction-posting-row').forEach(row => {
		if (row.dataset.transaction === target.dataset.id) row.classList.toggle('hide');
	});
}

function toggleAuth() {
	const isLoggedIn = !!pb.authStore.record;
	DOM.wrapper.classList.toggle('hide', !isLoggedIn);
	DOM.loginContainer.classList.toggle('hide', isLoggedIn);
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

function openBillForm(e) {
	openTargetBillForm(e.currentTarget);
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
	DOM.accountTrack.checked = false;
	// selectOption(DOM.accountCurrency);
	if (target.dataset.id) {
		DOM.accountId.value = target.dataset.id;
		editAccount(target.dataset.id);
	}
	if (!visibleModal) openModal(DOM.accountModal);
}

function openTargetBillForm(target) {
	DOM.billTitle.textContent = 'Add Bill';
	setError(DOM.billError);
	DOM.billId.value = '';
	DOM.billDelete.value = '';
	DOM.billForm.reset();
	DOM.billOpenDeleteBtn.classList.add('hide');
	DOM.billOpenDeleteBtn.textContent = 'Delete';
	DOM.billDeleteBtn.classList.add('hide');
	DOM.billDate.valueAsDate = new Date();
	setTimeout(() => DOM.billDate.focus(), 100);
	DOM.billAccountId.value = '';
	DOM.billAccount.value = '';
	DOM.billAmount.value = '';
	DOM.billTransaction.innerHTML = '';
	DOM.billTransaction.classList.add('hide');
	if (target.dataset.id) {
		DOM.billId.value = target.dataset.id;
		editBill(target.dataset.id);
	}
	if (!visibleModal) openModal(DOM.billModal);
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
	DOM.transactionTags.value = '';
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

function toggleBillDelete(e) {
	DOM.billDeleteBtn.classList.toggle('hide');
	DOM.billDeleteBtn.classList.contains('hide') ?
		DOM.billOpenDeleteBtn.textContent = 'Delete' : DOM.billOpenDeleteBtn.textContent = 'Cancel';
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
				createElement('td', { textContent: acct.track ? 'Tracked' : '', class: 'text-right' }),
			],
		}));
		DOM.accountDatalist.append(createElement('option', {
			value: acct.name,
			dataset: { id: acct.id }
		}));
	});
}

async function renderBills() {
	const records = await pb.collection('bills').getFullList({
		sort: 'date',
		expand: 'account',
	});
	DOM.billList.innerHTML = '';
	records.forEach((bill) => {
		DOM.billList.append(createElement('tr', {
			class: 'bill-row pointer row-hover',
			dataset: { id: bill.id },
			children: [
				createElement('th', { attributes: { scope: 'row' }, textContent: utcToLocal(bill.date) }),
				createElement('td', { textContent: bill.expand.account.name }),
				createElement('td', { textContent: cur(bill.amount), class: 'text-right' }),
				createElement('td', { class: 'text-right' }),
				createElement('td', { class: 'text-right' }),
				createElement('td', { textContent: bill.transaction }),
			],
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
				createElement('td', { textContent: curr.default ? 'Default' : '', class: 'text-right' }),
			],
		}));
	});
}

async function renderPostings() {

}

async function updateTransactionPage(e) {
	let newPage = 1;
	if (e.target.dataset.step) newPage = STATE.transactionPage + parseInt(e.target.dataset.step);
	if (e.target.dataset.jump) newPage = parseInt(e.target.dataset.jump);
	if (newPage > STATE.transactionTotalPages || newPage < 1) return;
	await renderTransactions(newPage);
}

async function renderTransactions(page=1) {
	const records = await pb.collection('transactions').getList(page, SETTINGS.perPage, {
		sort: '-date,created',
		expand: 'postings_via_transaction,postings_via_transaction.account,postings_via_transaction.currency',
	});

	STATE.transactionPage = records.page;
	STATE.transactionTotalPages = records.totalPages;
	DOM.transactionPageCurrent.textContent = records.page;
	DOM.transactionPageTotal.textContent = records.totalPages;
	DOM.transactionPagePrev.disabled = page === 1;
	DOM.transactionPageNext.disabled = page === records.totalPages;

	DOM.transactionList.innerHTML = '';
	for (const txn of records.items) {
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
				createElement('td', { textContent: txn.tags.trim() || '' }),
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
	}
}

async function renderDatalists() {
	const records = await pb.collection('transactions').getFullList({
		sort: '-date,created',
		expand: 'postings_via_transaction,postings_via_transaction.account,postings_via_transaction.currency',
	});

	const payees = new Set();
	const tags = new Set();

	for (const txn of records) {

		if (txn.payee) payees.add(txn.payee);
		if (txn.tags.trim()) {
			txn.tags.trim().split(' ').forEach(tag => {
				tags.add(tag);
			});
		}
	}

	DOM.payeeDatalist.innerHTML = '';
	[...payees].sort().forEach(payee => {
		DOM.payeeDatalist.append(createElement('option', { value: payee }));
	});

	DOM.tagDatalist.innerHTML = '';
	[...tags].sort().forEach(tag => {
		DOM.tagDatalist.append(createElement('option', { value: tag }));
	});
}

async function renderReports() {
	await renderBalances();
}

async function renderAll() {
	await renderCurrencies();
	await renderAccounts();
	await renderTransactions();
	await renderBills();
	await renderDatalists();
	await renderReports();
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
