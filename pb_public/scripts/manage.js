async function submitEntry(e) {
	e.preventDefault();
	DOM.entryError.classList.add('hide');
	DOM.entryError.textContent = '';
	try {
		const formData = new FormData(DOM.entryForm);
		const type = formData.get('entry-type');
		const id = formData.get('entry-id');
		switch(type) {
			case 'account':
				break;
			case 'commodity':
				if (!id) {
					const record = await pb.collection('commodities').create({
						"user": pb.authStore.record.id,
						"name": formData.get('entry-commodity-name')
					});
					renderCommodities();
				}
				break;
			case 'transaction':

				break;
			default:
				throw new Error(`Type ${type} does not exist`);
		}
		closeModal(DOM.entry);
	} catch (err) {
		DOM.entryError.textContent = err;
		DOM.entryError.classList.remove('hide');
		console.error(`Unable to update entry`, err);
	}
}
