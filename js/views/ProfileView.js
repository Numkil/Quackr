var ProfileView = function (data) {
    //View for the overview screen
    //

    this.initialize = function () {
        // View constructor
        if (app.loggedin == true){
            var cats = app.model.getCategories();
            var provider = app.userProfile.identities[0].provider;
            var myRegex = /(.*)\-oauth2/;
            var provider = myRegex.exec(provider)[1];
            render('profile', {
                name: app.userProfile.name,
                picture: app.userProfile.picture,
                provider: provider,
                categories: cats,
            });
            cats.forEach(function(cat){
                var progress = app.model.getCategoryAnswered(cat.id);
                $.extend(cat, progress);
                var progressbar = (cat.sizeFinished / cat.sizeQuestions)*100;
                $.getScript('js/progressbar.js').done(function(){
                    //create the progressbar
                    jQMProgressBar('pb_'+cat.id)
                        .setOuterTheme('b')
                        .setInnerTheme('e')
                        .isMini(true)
                        .setMax(progressbar)
                        .setStartFrom(0)
                        .setInterval(10)
                        .showCounter(true)
                        .build()
                        .run();
                });
                //$("#pb_"+cat.id).progressbar({
                    //value: progressbar,
                //});
            });
        } else {
            //Re-render and show login page with login filled in
            //TODO: Show error message
            log('Not logged in for profile!');
            redirect('#login');
        }
    }

    this.initialize();
}
