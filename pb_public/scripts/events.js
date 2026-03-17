function attachListeners() {
	DOM.asideBtns.forEach((b) => b.addEventListener('click', openSection));
	DOM.transactionAddBtn.addEventListener('click', openTransactionForm);
	DOM.transactionForm.addEventListener('submit', submitTransaction);
	DOM.transactionOpenDeleteBtn.addEventListener('click', toggleDelete);
	DOM.transactionDeleteBtn.addEventListener('click', deleteTransaction);
	DOM.loginForm.addEventListener('submit', login);
	DOM.logout.addEventListener('click', logout);
	DOM.toggleModals.forEach((m) => m.addEventListener('click', toggleModal));
	DOM.transactionAddPostingBtn.addEventListener('click', addPosting);

	DOM.transactionPostings.addEventListener('click', (e) => {
		e.preventDefault();
		const deleteBtn = e.target.closest('.transaction-delete-posting-btn');
		if (deleteBtn) removePosting(deleteBtn);
	});

	DOM.transactionList.addEventListener('click', (e) => {
		e.preventDefault();
		const txn = e.target.closest('.transaction-row');
		if (txn) openTargetTransactionForm(txn);
	});
}
