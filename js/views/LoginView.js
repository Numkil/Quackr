var LoginView = function (data) {
//View for the login screen and login functionality

	this.initialize = function () {
	// View constructor
		if (this.checkLogin(data[0], data[1]) == true){
			//TODO: set global vars/session
			render('overview', {});
		} else {
			//TODO: Pre-fill in username and show (error) message
			render('login', data[0]);
		}
	}

	this.checkLogin = function(email, pass) {
	// Login functionality to check for login
		pass = sha1('salt' + pass + 'othersalt');
		//TODO: Check our REST api
		return true; //temporary, until we get some REST goodness
	}

	this.initialize();
}