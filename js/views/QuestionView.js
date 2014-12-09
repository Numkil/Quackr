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
                  	var selected;
                  	render('question', {
                  		question: result
                  	});
                    $.getScript('js/progressbar.js').done(function(){
                          //create the progressbar
                          jQMProgressBar('pb_question')
                            .setOuterTheme('b')
                            .setInnerTheme('e')
                            .isMini(true)
                            .setMax(100)
                            .setStartFrom(0)
                            .setInterval(10)
                            .showCounter(true)
                            .build()
                            .run();
                    });
                    /**
                  	//hook the radiobuttons
                  	$('input[name=answer]').change(function() {
            					selected = $(this).val();
            					log(selected);
            					log($(this).val());
            					$('#go').button('enable').button('refresh');
            					log('selected: ' + selected);
            				});
                  	//hook the button
                  	$('button#go').attr("disabled", "disabled");
                  	$('button#go').click(function(){
                  		//get answer
                  		var correct;
                  		result.propanswers.forEach(function(entry){ //dirty, should be done better on API side
                  			if (entry.correct == '1'){
                  				correct = entry.id;
                  			}
                  		});
                  		//validate question
                  		if (correct == selected){
                  			log('correct');
                  		} else {
                  			log('wrong');
                  		}
                  	});
                  	log('button hooked');
                    **/
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