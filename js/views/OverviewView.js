var OverviewView = function (data) {
//View for the overview screen

	this.initialize = function () {
	// View constructor
		if (app.loggedin == true){

            $.get(
                'http://d00med.net/quackr/secured/ping',
                function(data) {  console.log('GET DONE'); console.log(data); }
            );

            render('overview', {
            	name: app.userProfile.name,
            	picture: app.userProfile.picture
            });
            setInfoMessage('Welcome back mate!');
		} else {
			//Re-render and show login page with login filled in
			//TODO: Show error message
			log('Not logged in for overview!');
			redirect('#login');
		}
	}	

	this.initialize();
}