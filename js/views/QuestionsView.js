var QuestionsView = function (data) {
//View for the overview screen

	this.initialize = function () {
	// View constructor
		if (app.loggedin == true){
			//Show all categories

            log('Loading all categories..');
            cats = app.model.getCategories();
            log('Loading random questions..');
            results = [];
            cats.forEach(function (entry){
            	var cat = {
            		category: entry,
            		questions: app.model.getRandomQuestions(entry.id, 3),
            	};
            	results.push(cat);
            });
            if (results){
                  log('Questions in template: ');
            	log(results)
            	render('randomquestions', {
            		entries: results
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