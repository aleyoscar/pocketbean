function getPostings() {
	return Array.from(DOM.transactionForm.querySelectorAll('.transaction-posting')).map((posting, i) => {
		const account = posting.querySelector('.transaction-posting-account').value;
		const amount = posting.querySelector('.transaction-posting-amount').value;
		const order = i;
		return { account, amount, order };
	});
}

async function submitTransaction(e) {
	e.preventDefault();
	DOM.transactionError.classList.add('hide');
	DOM.transactionError.textContent = '';
	try {
		const formData = new FormData(DOM.transactionForm);
		const id = formData.get('transaction-id');
		const del = formData.get('transaction-delete');
		let record;
		if (del && id) {
			await pb.collection('transactions').delete(id);
		} else {
			const data = {
				"user": pb.authStore.record.id,
				"date": localToUtc(formData.get('transaction-date')),
				"flag": formData.get('transaction-flag') ? true : false,
				"payee": formData.get('transaction-payee'),
				"narration": formData.get('transaction-narration'),
				"tags": formData.get('transaction-tags'),
				"links": formData.get('transaction-links'),
				"postings": getPostings(),
			};
			if (id) record = await pb.collection('transactions').update(id, data);
			else record = await pb.collection('transactions').create(data);
		}
		await renderTransactions();
		closeModal(DOM.transactionModal);
	} catch (err) {
		DOM.transactionError.textContent = err;
		DOM.transactionError.classList.remove('hide');
		console.error(`Unable to update transaction`, err);
	}
}

async function deleteTransaction(e) {
	DOM.transactionDelete.value = 'delete';
	submitTransaction(e);
}

async function editTransaction(id) {
	try {
		const record = await pb.collection('transactions').getOne(id);
		if (!record) throw new Error(`Unable to edit account with id ${id}`);
		DOM.transactionTitle.textContent = 'Edit Transaction';
		DOM.transactionId.value = id;
		DOM.transactionOpenDeleteBtn.classList.remove('hide');
		DOM.transactionDate.value = utcToLocal(record.date);
		DOM.transactionFlag.checked = record.flag;
		DOM.transactionPayee.value = record.payee;
		DOM.transactionNarration.value = record.narration;
		DOM.transactionTags.value = record.tags;
		DOM.transactionLinks.value = record.links;
		if (record.postings.length > 2) {
			for (let i = 2; i < record.postings.length; i++) {
				DOM.transactionPostings.append(createPosting());
			}
		}
		record.postings.forEach((posting) => {
			const postingEl = DOM.transactionForm.querySelector(`.transaction-posting-${posting.order}`);
			postingEl.querySelector('.transaction-posting-account').value = posting.account;
			postingEl.querySelector('.transaction-posting-amount').value = posting.amount;
		});
	} catch (err) {
		DOM.transactionError.textContent = err;
		DOM.transactionError.classList.remove('hide');
		console.error('Unable to edit account', err);
	}
}
