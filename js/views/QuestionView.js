var QuestionView = function (data) {
    //View for the overview screen

    this.createProgressBar = function() {
        var answered = app.model.getCategoryAnswered(data);
        if (answered){
            var progress = Math.round(answered.sizeFinished / answered.sizeQuestions);
            /**
              What does this do?
              $.extend(cat, progress);
              log(cat);
             **/
            var gage = new JustGage({
                id: 'pb_question',
                value: (progress * 100),
                min: 0,
                max: 100,
                title: '',
                label: '%',
                donut: true,
            });
            /**
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
            });**/
        }
    },

    this.initialize = function () {

        var retrieveNewQuestion = function(){
            shake.stopWatch();
            //Loading screen on fetching a new question
            //$.mobile.loading( "show", {
                //text: "Fetching new question!",
                //textVisible: true,
                //theme: "b",
                //html: ""
            //});

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
