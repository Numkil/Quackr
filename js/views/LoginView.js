var LoginView = function (data) {
//View for the login screen and login functionality

	this.initialize = function () {
	// View constructor
		if (data){
			console.log('loginview data passed along');
			if (this.checkLogin(data[0], data[1]) == true){
				app.loggedin = true;
				redirect('#overview');
			} else {
				//Re-render and show login page with login filled in
				//TODO: SHow username pre-filled in
				redirect('#login');
			}
		} else {
			console.log('loginview no data passed');
			render('login', {});
		}
	}

	this.checkLogin = function(email, pass) {
	// Login functionality to check for login
		pass = Sha256.hash('salt' + pass + 'othersalt');
		console.log('checklogin: ' + email + ' , ' + pass);
		//TODO: Check our REST api
		return true; //temporary, until we get some REST goodness
	}

	this.initialize();
}