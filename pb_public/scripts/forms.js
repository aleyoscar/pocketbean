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
				"track": DOM.accountTrack.checked,
			};
			if (id) record = await pb.collection('accounts').update(id, data);
			else record = await pb.collection('accounts').create(data);
		}
		await renderAll();
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
				tags: ` ${DOM.transactionTags.value.trim()} `,
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

		await renderAll();
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
		DOM.accountTrack.checked = record.track;
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
		DOM.transactionTags.value = record.tags.trim() || '';

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
