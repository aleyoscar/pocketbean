function renderAccountTree(posting, container, level=0) {
	const acctArr = posting.expand.account.name.split(':');
	const acctName = acctArr[level];
	let nodeId = `balances-${acctArr[0].toLowerCase()}`;
	for (let i = 0; i < level; i++) {
		nodeId += `-${acctArr[i+1].toLowerCase()}`;
	}
	let node = document.getElementById(nodeId);
	if (node) {
		const nodeAmount = node.querySelector('.balances-amount');
		nodeAmount.textContent = cur(dec(nodeAmount.textContent) + dec(posting.amount));
	} else {
		node = createElement('details', {
			id: nodeId,
			attributes: { open: 'open' },
			children: [
				createElement('summary', {
					innerHTML: `${acctName}
						<span class="ml-auto inline-block flex gap-sm">
							<strong class='balances-amount'>${cur(dec(posting.amount))}</strong>
							<span>${posting.expand.account.expand.currency.name}</span>
						</span>`,
				}),
			],
			style: { marginLeft: `${level * 20}px` },
		});
		container.appendChild(node);
	}
	if (level < acctArr.length - 1) {
		renderAccountTree(posting, node, level + 1);
	}
}

async function renderBalances() {
	try {
		const postings = await pb.collection('postings').getFullList({
			sort: "account.name",
			expand: "account,account.currency",
		});

		postings.forEach(posting => {
			renderAccountTree(posting, DOM.balancesContainer);
		});

		DOM.balancesContainer.querySelectorAll('.balances-amount').forEach(bal => {
			bal.classList.toggle('neg', dec(bal.textContent) < 0);
			bal.classList.toggle('pos', dec(bal.textContent) > 0);
		});

	} catch (err) {
			console.error("Failed to load account tree:", err);
	}
}
