var CategoryView = function (id) {
//View for the overview screen

	this.initialize = function () {
	// View constructor
		if (app.loggedin == true){

            log('Loading category... ' + 'http://d00med.net/quackr/secured/category/' + id);

            $.ajax('http://d00med.net/quackr/secured/category/' + id)
            	.done(function (category){
            		if (category == null){
            			setErrorMessage("Could not retrieve category.");
            			log('getCategory error: ' + error + " , " + request + " , " + status);
            			render('overview');
            			return;
            		} else {
            			category = $.parseJSON(category);
            			log(category);
            			render('category', {
			            	name: app.userProfile.name,
		            		picture: app.userProfile.picture,
		            		category: category
            			});
            		}
            	})
 				.error(function (request, status, error){
            			setErrorMessage("Could not retrieve category.");
            			log('getCategory error: ' + error + " , " + request + " , " + status);
            			render('overview');
            			return;
        		});
  
		} else {
			//Re-render and show login page with login filled in
			//TODO: Show error message
			log('Not logged in for category!');
			redirect('#login');
		}
	}	

	this.initialize();
}