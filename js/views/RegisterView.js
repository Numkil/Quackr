var RegisterView = function (data) {
//View for the login screen and login functionality

	this.initialize = function () {
	// View constructor
		if (data){
			//Trying to register.
			if (this.register(data[0], data[1]) == true){
				//TODO: Show successful message
				log('registration successful');
				redirect('#login');
			} else {
				//TODO: Show error message
				log('error in registration');
				redirect('#register');
			}
		} else {
			//No data passed
			log('no data in registration form');
			render('register', {});
		}
	}

	this.register = function(email, pass) {
	// Login functionality to check for login
		pass = sha1('salt' + pass + 'othersalt');
		//TODO: Check our REST api
		return true; //temporary, until we get some REST goodness
	}

	this.initialize();
}