var QuestionsView = function (data) {
//View for the overview screen

	this.initialize = function () {
	// View constructor
		if (app.loggedin == true){
			//Show all categories

            log('Loading questions..');
            results = app.model.getQuestions(data);
            if (results){
            	log(results)
            	render('questions', {
            		questions: results
            	});
            } else {
            	setErrorMessage('Error retrieving questions.');
            	goToScreen();
            }
		} else {
			//Re-render and show login page with login filled in
			setErrorMessage('You are not logged in!');
			log('Not logged in for questions!');
			redirect('login');
		}
	}	

	this.initialize();
}