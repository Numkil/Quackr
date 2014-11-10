var LoginView = function (data) {
//View for the login screen and login functionality

	this.initialize = function () {
	// View constructor
		
	}

	this.register = function(email, pass) {
	// Login functionality to check for login
		pass = sha1('salt' + pass + 'othersalt');
		//TODO: Check our REST api
		return true; //temporary, until we get some REST goodness
	}

	this.initialize();
}