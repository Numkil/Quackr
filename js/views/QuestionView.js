var QuestionView = function (data) {
    //View for the overview screen

    this.createProgressBar = function() {
        var answered = app.model.getCategoryAnswered(data);
        if (answered){
            var progress = Math.round(answered.sizeFinished / answered.sizeQuestions);
            var gage = new JustGage({
                id: 'pb_question',
                value: (progress * 100),
                min: 0,
                max: 100,
                title: '',
                label: '%',
                donut: true,
            });
        }
    },

    this.initialize = function () {

        var retrieveNewQuestion = function(){
            shake.stopWatch();

            var message = $('#deviceIsReady');
            message.innerHTML = "Fetching new Question";
            message.css('color', 'red');

            //try retrieving more
            log('Trying to retrieve more questions for the cache..');
            if (app.model.getMoreQuestions()){
                log('YES! Reloading..');
                redirect('question?id=' + data);
            } else {
                log('Nope, failed.');
                setInfoMessage('There are no questions left! Turn on internet access and try this again.');
                redirect('categories');
            }
        };

        //We don't want to have to back back back our way out of every single question we answered
        //IT is not at all perfect but the best thing I can find for now
        var backKeyDown = function(){
            redirect('categories');
        };

        // View constructor
        if (app.loggedin == true){
            //Show all categories
            log('Loading question..');
            result = app.model.getRandomQuestion(data);
            if (result){
                log('This will be filled in:');
                log(result);
                result.catid = data;
                render('question', {
                    question: result,
                    //catid: data,
                }).done( function (){
                    shake.startWatch(retrieveNewQuestion);
                    this.createProgressBar();
                    document.addEventListener("backbutton", backKeyDown, true);
                });
            } else {
                retrieveNewQuestion();
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
