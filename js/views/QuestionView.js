var QuestionView = function (data) {
//View for the overview screen

  this.createProgressBar = function() {
    var answered = app.model.getCategoryAnswered(data);
    if (answered){
      var progress = Math.round(answered.sizeFinished / answered.sizeQuestions);
      log('Current category progress: ' + progress);
      $.getScript('js/progressbar.js').done(function(){
            //create the progressbar
            jQMProgressBar('pb_question')
              .setOuterTheme('b')
              .setInnerTheme('e')
              .isMini(true)
              .setMax(progress)
              .setStartFrom(0)
              .setInterval(10)
              .showCounter(true)
              .build()
              .run();
      });
    }
  }

	this.initialize = function () {
	// View constructor
		if (app.loggedin == true){
			//Show all categories
      log('Loading question..');
      result = app.model.getQuestion(data);
      if (result){
      	log(result);
        result.catid = data;
      	render('question', {
      		question: result,
      	});
        this.createProgressBar();
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