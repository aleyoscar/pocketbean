async function login(e) {
	e.preventDefault();
	setError(DOM.loginError);
	DOM.loginSubmit.disabled = true;
	try {
		const formData = new FormData(DOM.login);
		const username = DOM.loginUsername.value.trim();
		const password = DOM.loginPassword.value.trim();
		if (!username || !password) throw new Error("Please enter both username and password");
		const authData = await pb.collection("users").authWithPassword(username, password);
		DOM.loginForm.reset();
		await renderAll();
	} catch (err) {
		setError(DOM.loginError, err);
	} finally {
		toggleAuth();
		DOM.loginSubmit.disabled = false;
	}
}

function logout() {
	pb.authStore.clear();
	toggleAuth();
}
