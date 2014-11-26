var CategoriesView = function (data) {
//View for the overview screen

	this.initialize = function () {
	// View constructor
		if (app.loggedin == true){

            log('Loading categories..');

            $.ajax('http://d00med.net/quackr/categories')
            	.done(function (categories){
            		categories = $.parseJSON(categories);
            		log(categories);
            		render('categories', {
		            	name: app.userProfile.name,
		            	picture: app.userProfile.picture,
		            	categories: categories
			        });
            	})
 				.error(function (request, status, error){
            			setErrorMessage(error);
            			log('getCategories error: ' + error + " , " + request + " , " + status);
            			render('overview');
        		});
  
		} else {
			//Re-render and show login page with login filled in
			//TODO: Show error message
			log('Not logged in for categories!');
			redirect('#login');
		}
	}	

	this.initialize();
}