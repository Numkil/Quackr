var CategoriesView = function (data) {
//View for the overview screen

	this.initialize = function () {
	// View constructor
		if (app.loggedin == true){
			//Show all categories

            log('Loading categories..');
            cats = app.model.getCategories();
            if (cats){
            	log('cats good');
            	log(cats);
            	render('categories', {
            		categories: cats
            	});
            } else {
            	setErrorMessage('Error retrieving category.');
            	goToScreen();
            }
		} else {
			//Re-render and show login page with login filled in
			setErrorMessage('You are not logged in!');
			log('Not logged in for categories!');
			redirect('login');
		}
	}	

	this.initialize();
}