async function submitEntry(e) {
	e.preventDefault();
	DOM.entryError.classList.add('hide');
	DOM.entryError.textContent = '';
	try {
		const formData = new FormData(DOM.entryForm);
		const type = formData.get('entry-type');
		const id = formData.get('entry-id');
		const del = formData.get('entry-delete');
		let record;
		switch(type) {
			case 'account':
				break;
			case 'commodity':
				if (del && id) {
					await pb.collection('commodities').delete(id);
				} else {
					const commodityData = {
						"user": pb.authStore.record.id,
						"name": formData.get('entry-commodity-name')
					}
					if (id) record = await pb.collection('commodities').update(id, commodityData);
					else record = await pb.collection('commodities').create(commodityData);
				}
				renderCommodities();
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

async function deleteEntry(e) {
	DOM.entryDelete.value = 'delete';
	submitEntry(e);
}

async function editCommodity(id) {
	DOM.entryError.classList.add('hide');
	DOM.entryError.textContent = '';
	try {
		const record = await pb.collection('commodities').getOne(id);
		if (!record) throw new Error(`Unable to edit commodity with id ${id}`);
		DOM.entryTitle.textContent = 'Edit Commodity';
		DOM.entryCommodityName.value = record.name;
		DOM.entryNav.classList.add('hide');
		DOM.entryOpenDeleteBtn.classList.remove('hide');
	} catch (err) {
		DOM.entryError.textContent = err;
		DOM.entryError.classList.remove('hide');
		console.error('Unable to edit commodity', err);
	}
}
