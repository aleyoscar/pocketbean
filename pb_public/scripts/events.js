function attachListeners() {
	DOM.asideBtns.forEach((b) => b.addEventListener('click', openSection));
	DOM.entryForm.addEventListener('submit', submitEntry);
	DOM.entryFieldsetBtns.forEach((b) => b.addEventListener('click', openFieldset));
	DOM.login.addEventListener('submit', login);
	DOM.logout.addEventListener('click', logout);
	DOM.toggleModals.forEach((m) => m.addEventListener('click', toggleModal));

	DOM.commodityList.addEventListener('click', (e) => {
		const commodityRow = e.target.closest('.commodity-row');
		if (commodityRow) openFieldsetTarget(commodityRow);
	});
}
