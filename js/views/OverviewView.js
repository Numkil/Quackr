var OverviewView = function (data) {
//View for the login screen and login functionality

	this.initialize = function () {
	// View constructor
		if (this.checkLogin(data[0], data[1]) == true){
			app.loggedin = true;
			render('overview', {});
		} else {
			//Re-render and show login page with login filled in
			//TODO: Show error message
			render('login', {}});
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