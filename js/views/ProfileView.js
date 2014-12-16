var ProfileView = function (data) {
//View for the overview screen

	this.initialize = function () {
	// View constructor
		if (app.loggedin == true){
			//log(app.userProfile);
			
			//log('random question:');
			//log(app.model.getRandomQuestion('2'));

            var provider = app.userProfile.identities[0].provider;
            var myRegex = /(.*)\-oauth2/;
            var provider = myRegex.exec(provider)[1];
            render('profile', {
            	name: app.userProfile.name,
            	picture: app.userProfile.picture,
                provider: provider
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
