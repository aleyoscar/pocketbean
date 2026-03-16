function toggleAuth() {
	DOM.wrapper.classList.toggle('hide', !pb.authStore.record);
	DOM.login.classList.toggle('hide', pb.authStore.record);
	DOM.account.textContent = pb.authStore.record ? pb.authStore.record.username : '';
}

function openSection(e) {
	e.preventDefault();
	DOM.sections.forEach((s) =>
		s.classList.toggle('hide', !s.id.includes(e.currentTarget.dataset.section)));
	DOM.asideBtns.forEach((b) =>
		b.classList.toggle('secondary', b.dataset.section != e.currentTarget.dataset.section));
}

function openFieldset(e) {
	e.preventDefault();
	DOM.entryForm.reset();
	DOM.entryNav.classList.remove('hide');
	openFieldsetTarget(e.currentTarget);
}

function openFieldsetTarget(target) {
	const fieldset = target.dataset.fieldset;
	DOM.entryType.value = fieldset;
	DOM.entryFieldsets.forEach((f) =>
		f.classList.toggle('hide', !f.id.includes(fieldset)));
	DOM.entryNavFieldsetBtns.forEach((b) =>
		b.classList.toggle('secondary', b.dataset.fieldset != fieldset));
	DOM.entryTitle.textContent = capitalize(fieldset);
	if (target.dataset.id) {
		DOM.entryId.value = target.dataset.id;
		editCommodity(target.dataset.id);
	} else {
		DOM.entryId.value = '';
	}
	if (!visibleModal) openModal(DOM.entry);
}

async function renderCommodities() {
	const records = await pb.collection('commodities').getFullList();
	DOM.commodityList.innerHTML = '';
	records.forEach((r) => {
		DOM.commodityList.append(createElement('tr', {
			class: 'commodity-row',
			dataset: { id: r.id, fieldset: 'commodity' },
			children: [
				createElement('th', {
					class: 'pointer row-hover',
					attributes: { scope: 'row' },
					textContent: r.name
				}),
			],
		}));
	});
}
