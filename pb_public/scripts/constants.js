const pb = new PocketBase("/");

const DOM = {
	asideBtns: document.querySelectorAll('.aside-btn'),
	account: document.getElementById('account'),

	accountList: document.getElementById('account-list'),
	billList: document.getElementById('bill-list'),
	currencyList: document.getElementById('currency-list'),
	transactionList: document.getElementById('transaction-list'),

	accountDatalist: document.getElementById('account-datalist'),
	payeeDatalist: document.getElementById('payee-datalist'),
	tagDatalist: document.getElementById('tag-datalist'),

	accounts: document.getElementById('accounts'),
	bills: document.getElementById('bills'),
	currencies: document.getElementById('currencies'),
	transactions: document.getElementById('transactions'),
	balances: document.getElementById('balances'),

	accountAddBtn: document.getElementById('account-add-btn'),
	billAddBtn: document.getElementById('bill-add-btn'),
	currencyAddBtn: document.getElementById('currency-add-btn'),
	transactionAddBtn: document.getElementById('transaction-add-btn'),

	accountModal: document.getElementById('account-modal'),
	billModal: document.getElementById('bill-modal'),
	currencyModal: document.getElementById('currency-modal'),
	transactionModal: document.getElementById('transaction-modal'),

	accountForm: document.getElementById('account-form'),
	billForm: document.getElementById('bill-form'),
	currencyForm: document.getElementById('currency-form'),
	transactionForm: document.getElementById('transaction-form'),

	accountTitle: document.getElementById('account-title'),
	accountError: document.getElementById('account-error'),
	accountId: document.getElementById('account-id'),
	accountDelete: document.getElementById('account-delete'),
	accountName: document.getElementById('account-name'),
	accountCurrency: document.getElementById('account-currency'),
	accountTrack: document.getElementById('account-track'),
	accountOpenDeleteBtn: document.getElementById('account-open-delete-btn'),
	accountDeleteBtn: document.getElementById('account-delete-btn'),
	accountSubmitBtn: document.getElementById('account-submit-btn'),

	billTitle: document.getElementById('bill-title'),
	billError: document.getElementById('bill-error'),
	billId: document.getElementById('bill-id'),
	billDelete: document.getElementById('bill-delete'),
	billDate: document.getElementById('bill-date'),
	billAccount: document.getElementById('bill-account'),
	billAccountId: document.getElementById('bill-account-id'),
	billAmount: document.getElementById('bill-amount'),
	billTransaction: document.getElementById('bill-transaction'),
	billOpenDeleteBtn: document.getElementById('bill-open-delete-btn'),
	billDeleteBtn: document.getElementById('bill-delete-btn'),
	billSubmitBtn: document.getElementById('bill-submit-btn'),

	currencyTitle: document.getElementById('currency-title'),
	currencyError: document.getElementById('currency-error'),
	currencyId: document.getElementById('currency-id'),
	currencyDelete: document.getElementById('currency-delete'),
	currencyName: document.getElementById('currency-name'),
	currencyDefault: document.getElementById('currency-default'),
	currencyOpenDeleteBtn: document.getElementById('currency-open-delete-btn'),
	currencyDeleteBtn: document.getElementById('currency-delete-btn'),
	currencySubmitBtn: document.getElementById('currency-submit-btn'),

	transactionTitle: document.getElementById('transaction-title'),
	transactionError: document.getElementById('transaction-error'),
	transactionId: document.getElementById('transaction-id'),
	transactionDelete: document.getElementById('transaction-delete'),
	transactionDate: document.getElementById('transaction-date'),
	transactionFlag: document.getElementById('transaction-flag'),
	transactionPayee: document.getElementById('transaction-payee'),
	transactionNotes: document.getElementById('transaction-notes'),
	transactionTags: document.getElementById('transaction-tags'),
	transactionAddPostingBtn: document.getElementById('transaction-add-posting-btn'),
	transactionPostings: document.getElementById('transaction-postings'),
	transactionOpenDeleteBtn: document.getElementById('transaction-open-delete-btn'),
	transactionDeleteBtn: document.getElementById('transaction-delete-btn'),
	transactionSubmitBtn: document.getElementById('transaction-submit-btn'),

	transactionPagination: document.getElementById('transaction-pagination'),
	transactionPagePrev: document.getElementById('transaction-page-prev'),
	transactionPageCurrent: document.getElementById('transaction-page-current'),
	transactionPageTotal: document.getElementById('transaction-page-total'),
	transactionPageNext: document.getElementById('transaction-page-next'),

	loginContainer: document.getElementById('login-container'),
	loginForm: document.getElementById('login-form'),
	loginError: document.getElementById('login-error'),
	loginUsername: document.getElementById('login-username'),
	loginPassword: document.getElementById('login-password'),
	loginSubmit: document.getElementById('login-submit'),
	logout: document.getElementById('logout'),

	sections: document.querySelectorAll('main section'),
	toggleModals: document.querySelectorAll('.toggle-modal'),
	wrapper: document.getElementById('wrapper'),

	balancesTree: document.getElementById('balances-tree'),
	balancesList: document.getElementById('balances-list'),
}

const SETTINGS = {
	perPage: 30,
}

const STATE = {
	transactionPage: 1,
	transactionTotalPages: 1,
}
