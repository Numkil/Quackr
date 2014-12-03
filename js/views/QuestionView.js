var QuestionView = function (data) {
//View for the overview screen

	this.initialize = function () {
	// View constructor
		if (app.loggedin == true){
			//Show all categories

            log('Loading question..');
            result = app.model.getQuestion(data);
            if (result){
            	log(result);
            	render('question', {
            		question: result
            	});
            	createProgressBar('pb_question', 40);
            } else {
            	setErrorMessage('Error retrieving question.');
            	goToScreen();
            }
		} else {
			//Re-render and show login page with login filled in
			setErrorMessage('You are not logged in!');
			log('Not logged in for question!');
			redirect('login');
		}
	}	

	this.initialize();
}
