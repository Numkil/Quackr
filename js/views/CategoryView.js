var CategoryView = function (id) {
//View for the overview screen

	this.initialize = function () {
	// View constructor
		if (app.loggedin == true){

            log('Loading category... ');

            results = app.model.getQuestions(id);
            if (results){
                  render('questions', {
                        questions: results
                  });
            } else {
                  setErrorMessage('Error retrieving questions.');
                  goToScreen();
            }
  
		} else {
			//Re-render and show login page with login filled in
			//TODO: Show error message
			log('Not logged in for category!');
			redirect('#login');
		}
	}	

	this.initialize();
}