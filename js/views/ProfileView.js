var ProfileView = function (data) {
//View for the overview screen

	this.initialize = function () {
	// View constructor
		if (app.loggedin == true){
			//log(app.userProfile);
			
			//log('random question:');
			//log(app.model.getRandomQuestion('2'));

            render('profile', {
            	name: app.userProfile.name,
            	picture: app.userProfile.picture
            });
		} else {
			//Re-render and show login page with login filled in
			//TODO: Show error message
			log('Not logged in for profile!');
			redirect('#login');
		}
	}	

	this.initialize();
}