function toggleAuth() {
	DOM.wrapper.classList.toggle('hide', !pb.authStore.record);
	DOM.loginForm.classList.toggle('hide', pb.authStore.record);
	DOM.account.textContent = pb.authStore.record ? pb.authStore.record.username : '';
}

function openSection(e) {
	e.preventDefault();
	DOM.sections.forEach((s) =>
		s.classList.toggle('hide', !s.id.includes(e.currentTarget.dataset.section)));
	DOM.asideBtns.forEach((b) =>
		b.classList.toggle('secondary', b.dataset.section != e.currentTarget.dataset.section));
}

function openTransactionForm(e) {
	openTargetTransactionForm(e.currentTarget);
}

function openTargetTransactionForm(target) {
	DOM.transactionError.textContent = '';
	DOM.transactionError.classList.add('hide');
	DOM.transactionForm.reset();
	DOM.transactionOpenDeleteBtn.classList.add('hide');
	DOM.transactionOpenDeleteBtn.textContent = 'Delete';
	DOM.transactionDeleteBtn.classList.add('hide');
	DOM.transactionDelete.value = '';
	DOM.transactionId.value = '';
	DOM.transactionDate.valueAsDate = new Date();
	DOM.transactionTags.value = '';
	DOM.transactionLinks.value = '';
	DOM.transactionPostings.innerHTML = '';
	DOM.transactionTitle.textContent = 'Add Transaction';
	if (target.dataset.id) {
		DOM.transactionId.value = target.dataset.id;
		editTransaction(target.dataset.id);
	}
	if (!visibleModal) openModal(DOM.transactionModal);
}

function toggleDelete(e) {
	DOM.transactionDeleteBtn.classList.toggle('hide');
	DOM.transactionDeleteBtn.classList.contains('hide') ?
		DOM.transactionOpenDeleteBtn.textContent = 'Delete' : DOM.transactionOpenDeleteBtn.textContent = 'Cancel';
}

function parseTransactions(records) {
	const txns = [];
	const payees = [];
	const tags = [];
	const links = [];
	const accounts = [];
	records.forEach((txn) => {
		txn.amount = 0;
		txn.tags.split(" ").forEach((tag) => {
			if (!tags.includes(tag)) tags.push(tag);
		});
		txn.links.split(" ").forEach((link) => {
			if (!links.includes(link)) links.push(link);
		});
		txn.postings.forEach((posting) => {
			if (!accounts.includes(posting.account)) accounts.push(posting.account);
			const amount = dec(posting.amount.split(" ")[0]);
			if (amount > 0) txn.amount += amount;
		});
		txns.push(txn);
	});

	return {txns, payees, tags, links, accounts};
}

async function renderTransactions() {
	const records = await pb.collection('transactions').getFullList();
	const data = parseTransactions(records);

	DOM.transactionList.innerHTML = '';
	DOM.payeeDatalist.innerHTML = '';
	DOM.tagsDatalist.innerHTML = '';
	DOM.linksDatalist.innerHTML = '';
	DOM.accountDatalist.innerHTML = '';
	DOM.accountList.innerHTML = '';
	data.txns.forEach((txn) => {
		DOM.transactionList.append(createElement('tr', {
			class: 'transaction-row pointer row-hover',
			dataset: { id: txn.id },
			children: [
				createElement('th', { attributes: { scope: 'row' }, textContent: utcToLocal(txn.date) }),
				createElement('td', { textContent: txn.flag ? '*' : '!' }),
				createElement('td', { textContent: txn.payee }),
				createElement('td', { textContent: txn.narration }),
				createElement('td', { textContent: txn.tags }),
				createElement('td', { textContent: txn.links }),
				createElement('td', { textContent: cur(txn.amount) }),
			],
		}));
	});
	data.payees.forEach((payee) => {
		DOM.payeeDatalist.append(createElement('option', { value: payee }));
	});
	data.tags.forEach((tag) => {
		DOM.tagsDatalist.append(createElement('option', { value: tag }));
	});
	data.links.forEach((link) => {
		DOM.linksDatalist.append(createElement('option', { value: link }));
	});
	data.accounts.forEach((account) => {
		DOM.accountDatalist.append(createElement('option', { value: account }));
		DOM.accountList.append(createElement('tr', {
			class: 'account-row pointer row-hover',
			children: [
				createElement('th', { attributes: { scope: 'row' }, textContent: account }),
			]
		}));
	});
}

function addPosting(e) {
	e.preventDefault();
	DOM.transactionPostings.append(createPosting());
}

function removePosting(target) {
	setTimeout(() => { target.parentNode.remove() }, 100);
}
