var OverviewView = function (data) {
//View for the overview screen

	this.initialize = function () {
	// View constructor
		if (app.loggedin || this.checkLogin(data[0], data[1]) == true){
			app.loggedin = true;
			redirect('#overview');
		} else {
			//Re-render and show login page with login filled in
			//TODO: Show error message
			redirect('#login');
		}
	}	

	this.initialize();
}