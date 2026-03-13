async function login(e) {
	e.preventDefault();
	DOM.loginError.classList.add('hide');
	DOM.loginError.textContent = '';
	try {
		const formData = new FormData(DOM.login);
		const username = formData.get('username');
		const password = formData.get('password');
		const authData = await pb.collection("users").authWithPassword(username, password);
		DOM.login.reset();
	} catch (err) {
		console.error('Unable to login', err);
		DOM.loginError.textContent = err;
		DOM.loginError.classList.remove('hide');
	} finally {
		toggleAuth();
	}
}

function logout() {
	pb.authStore.clear();
	toggleAuth();
}
