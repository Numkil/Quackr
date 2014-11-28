var CategoryView = function (data) {
//View for the overview screen

	this.initialize = function () {
	// View constructor
		if (app.loggedin == true){

            log('Loading category...');

            $.ajax('http://d00med.net/quackr/secured/category/' + data)
            	.done(function (category){
            		if (category == null){
            			error(null, null, "categories empty");
            			return;
            		}
            		log(category);
            	})
 				.error(function (request, status, error){
            			setErrorMessage(error);
            			log('getCategory error: ' + error + " , " + request + " , " + status);
            			render('overview');
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