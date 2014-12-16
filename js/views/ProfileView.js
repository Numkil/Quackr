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
            }).done( function(){
                cats.forEach(function(cat){
                    var progress = app.model.getCategoryAnswered(cat.id);
                    $.extend(cat, progress);
                    log(cat);
                    var gage = new JustGage({
                        id: cat.id+"_pb",
                        value: (cat.sizeFinished / cat.sizeQuestions)*100,
                        min: 0,
                        max: 100,
                        title: ' ',
                        label: '%'
                    });
                });
                $("#delete").click(function(){
                    app.model.deleteProgress();
                    window.location.reload();
                });
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
