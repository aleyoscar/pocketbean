
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

	DOM.transactionPagePrev.addEventListener('click', updateTransactionPage);
	DOM.transactionPageNext.addEventListener('click', updateTransactionPage);

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

async function bootstrap() {
	attachListeners();
	if (toggleAuth()) await renderAll();
}

bootstrap();
